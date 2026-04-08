'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useUploadThing } from '@/lib/uploadthing'
import { useAudioRecorder } from '@/lib/useAudioRecorder'
import { saveRecording } from '@/actions/recordings'
import { inngest } from '@/lib/inngest/client'
import { getAudioDuration } from '@/lib/getAudioDuration'
import {
  savePendingRecording,
  restorePendingRecording,
  clearPendingRecording,
} from '@/lib/pendingRecording'
import EveningCheckIn from '@/components/record/Index'
import type { MoodId, Step } from '@/components/record/types'

const MAX_RECORDING_SECONDS = 3 * 60

// ─── Types ─────────────────────────────────────────────────────────────────────

// We split uploads into two independent phases so they can run in parallel.
// Phase 1 result is stored here once audio upload resolves.
interface AudioUploadResult {
  audioUrl: string
  fileSize: number
  durationSeconds: number
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function RecordPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded, userId } = useAuth()

  const { recordingBlob, isRecording, startRecording, stopRecording } = useAudioRecorder()

  const { startUpload: startAudioUpload, isUploading: isAudioUploading } =
    useUploadThing('audioUploader')

  const { startUpload: startPhotoUpload, isUploading: isPhotoUploading } =
    useUploadThing('imageUploader')

  // ── UI state ───────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<Step>('mood')
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [audioProgress, setAudioProgress] = useState(0)
  const [photoProgress, setPhotoProgress] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  // ── Refs ───────────────────────────────────────────────────────────────────
  // audioUploadPromise: resolves with the upload result once Phase 1 completes.
  // Storing as a ref means Phase 2 (save) can await it regardless of when it fires.
  const audioUploadPromiseRef = useRef<Promise<AudioUploadResult> | null>(null)

  // Holds the raw blob — populated by useAudioRecorder's onstop callback
  const pendingAudioBlobRef = useRef<Blob | null>(null)

  // Tracks the mood at time of save (selectedMood state may lag in callbacks)
  const moodRef = useRef<MoodId | null>(null)

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRecording) { setSecondsElapsed(0); return }
    const id = setInterval(() => setSecondsElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [isRecording])

  useEffect(() => {
    if (secondsElapsed >= MAX_RECORDING_SECONDS) stopRecording()
  }, [secondsElapsed, stopRecording])

  // Keep moodRef in sync
  useEffect(() => { moodRef.current = selectedMood }, [selectedMood])

  // ── Phase 1: Audio upload — fires as soon as blob is ready ────────────────
  //
  // MediaRecorder fires its onstop event (and populates recordingBlob) shortly
  // after stopRecording() is called — usually within 100–300ms. We immediately
  // kick off the upload so it runs in the background while the user is on the
  // photo step. By the time they tap Save, audio is likely already done.

  const startAudioUploadPhase = useCallback(
    (blob: Blob): Promise<AudioUploadResult> => {
      return new Promise(async (resolve, reject) => {
        try {
          const durationSeconds = Math.round(await getAudioDuration(blob))
          const audioFile = new File(
            [blob],
            `evening-${userId ?? 'anon'}-${Date.now()}.webm`,
            { type: blob.type },
          )

          // Fake progress ticker — UploadThing doesn't expose byte-level progress.
          // Ticks to 92% and holds there until the real upload resolves.
          const ticker = setInterval(
            () => setAudioProgress((p) => Math.min(p + 0.07, 0.92)),
            220,
          )

          const res = await startAudioUpload([audioFile])
          clearInterval(ticker)
          setAudioProgress(1)

          if (!res?.[0]) throw new Error('Audio upload failed')

          resolve({
            audioUrl: res[0].ufsUrl,
            fileSize: audioFile.size,
            durationSeconds,
          })
        } catch (err) {
          reject(err)
        }
      })
    },
    [userId, startAudioUpload],
  )

  // Trigger Phase 1 the moment the blob arrives from MediaRecorder
  useEffect(() => {
    if (!recordingBlob) return
    pendingAudioBlobRef.current = recordingBlob

    // Only start upload if user is signed in — otherwise we wait for auth
    if (isSignedIn) {
      audioUploadPromiseRef.current = startAudioUploadPhase(recordingBlob)
    }
  }, [recordingBlob, isSignedIn, startAudioUploadPhase])

  // ── Phase 2: Photo upload + DB save — fires when user taps Save ───────────

  const startPhotoAndSave = useCallback(
    async (photoFile?: File) => {
      try {
        // Await Phase 1 (may already be resolved if audio upload finished)
        const audioResult = await audioUploadPromiseRef.current
        if (!audioResult) throw new Error('Audio upload result missing')

        // Photo upload (runs concurrently with awaiting audio if needed)
        let imageUrl: string | undefined
        if (photoFile) {
          const photoTicker = setInterval(
            () => setPhotoProgress((p) => Math.min(p + 0.09, 0.92)),
            180,
          )
          const photoRes = await startPhotoUpload([photoFile])
          clearInterval(photoTicker)
          setPhotoProgress(1)
          imageUrl = photoRes?.[0]?.ufsUrl
        } else {
          setPhotoProgress(1)
        }

        // Save everything to DB
        const { entry } = await saveRecording(
          audioResult.audioUrl,
          audioResult.fileSize,
          audioResult.durationSeconds,
          {
            imageUrl,
            userMood: moodRef.current ?? undefined,
          },
        )

        setIsSaved(true)
        await clearPendingRecording()
        await inngest.send({ name: 'entry/created', data: { entryId: entry?.id } })
        setTimeout(() => router.push('/archive'), 2000)
      } catch (err) {
        console.error('startPhotoAndSave failed:', err)
        // TODO: show error toast + retry option
      }
    },
    [startPhotoUpload, router],
  )

  // ── Auth gate ──────────────────────────────────────────────────────────────
  //
  // User tapped Save but isn't signed in. We:
  //   1. Persist blob + mood to IndexedDB (survives the redirect, handles large files)
  //   2. Persist photo to sessionStorage if small enough (<2MB)
  //   3. Redirect to Clerk sign-in — which returns to /record
  //   4. On return, the useEffect below detects the pending blob and resumes

  const handleAuthGate = useCallback(
    async (blob: Blob, photoFile?: File) => {
      await savePendingRecording(blob, moodRef.current)

      if (photoFile && photoFile.size < 2 * 1024 * 1024) {
        const reader = new FileReader()
        reader.readAsDataURL(photoFile)
        reader.onloadend = () => {
          sessionStorage.setItem('pendingPhoto', reader.result as string)
          sessionStorage.setItem('pendingPhotoName', photoFile.name)
          sessionStorage.setItem('pendingPhotoType', photoFile.type)
        }
      }

      router.push('/sign-in?redirect_url=/record')
    },
    [router],
  )

  // Restore + upload after returning from Clerk sign-in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    restorePendingRecording().then((pending) => {
      if (!pending) return

      const photoData = sessionStorage.getItem('pendingPhoto')

      const resume = (photoFile?: File) => {
        sessionStorage.removeItem('pendingPhoto')
        sessionStorage.removeItem('pendingPhotoName')
        sessionStorage.removeItem('pendingPhotoType')

        // Restore mood from persisted data
        if (pending.mood) {
          moodRef.current = pending.mood as MoodId
          setSelectedMood(pending.mood as MoodId)
        }

        // Kick off audio upload first, then save
        setCurrentStep('uploading')
        audioUploadPromiseRef.current = startAudioUploadPhase(pending.blob)
        startPhotoAndSave(photoFile)
      }

      if (photoData) {
        fetch(photoData)
          .then((r) => r.blob())
          .then((blob) => {
            const name = sessionStorage.getItem('pendingPhotoName') ?? 'photo.jpg'
            const type = sessionStorage.getItem('pendingPhotoType') ?? 'image/jpeg'
            resume(new File([blob], name, { type }))
          })
          .catch(() => resume())
      } else {
        resume()
      }
    })
  }, [isLoaded, isSignedIn, startAudioUploadPhase, startPhotoAndSave])

  // ── EveningCheckIn callbacks ───────────────────────────────────────────────

  const handleSaveWithPhoto = useCallback(
    (file: File) => {
      const blob = pendingAudioBlobRef.current
      if (!blob) return
      if (!isSignedIn) { handleAuthGate(blob, file); return }
      startPhotoAndSave(file)
    },
    [isSignedIn, handleAuthGate, startPhotoAndSave],
  )

  const handleSaveWithoutPhoto = useCallback(() => {
    const blob = pendingAudioBlobRef.current
    if (!blob) return
    if (!isSignedIn) { handleAuthGate(blob); return }
    startPhotoAndSave()
  }, [isSignedIn, handleAuthGate, startPhotoAndSave])

  useEffect(() => {
    if (isSaved) setCurrentStep('done')
  }, [isSaved])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#1a1a28]">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-[100dvh] bg-black">
      <EveningCheckIn
        isSignedIn={!!isSignedIn}
        recorder={{
          isRecording,
          secondsElapsed,
          maxSeconds: MAX_RECORDING_SECONDS,
          onStartRecording: startRecording,
          onStopRecording: stopRecording,
        }}
        upload={{
          audioUploadProgress: audioProgress,
          isAudioUploading,
          photoUploadProgress: photoProgress,
          isPhotoUploading,
          isSaved,
        }}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onMoodSelected={setSelectedMood}
        onRecordingDone={() => {}}
        onSaveWithPhoto={handleSaveWithPhoto}
        onSaveWithoutPhoto={handleSaveWithoutPhoto}
      />
    </main>
  )
}