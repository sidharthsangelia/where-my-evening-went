'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface PhotoStepProps {
  audioUploadProgress: number
  isAudioUploading: boolean
  /** Whether the user is currently signed in (from Clerk) */
  isSignedIn: boolean
  onSave: (file?: File) => void
}

/*
 * Auth philosophy:
 *   - Unauthenticated users can reach this step and see the full flow.
 *   - When they tap "Save evening", we check auth.
 *   - If not signed in → hand off to parent which persists blob and redirects.
 *   - If signed in → proceed normally.
 * This maximises trial conversions — the user experiences the full product
 * before hitting any sign-up friction.
 */

export default function PhotoStep({
  audioUploadProgress,
  isAudioUploading,
  isSignedIn,
  onSave,
}: PhotoStepProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = () => {
    // Parent handles auth redirect if not signed in
    onSave(photoFile ?? undefined)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex flex-col px-5 pt-4 pb-4 gap-5">
        {/* ── Audio upload status bar ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  isAudioUploading ? 'bg-yellow-300 animate-pulse' : 'bg-emerald-400',
                )}
              />
              <span className="text-white/70 text-xs">
                {isAudioUploading
                  ? `Saving audio — ${Math.round(audioUploadProgress * 100)}%`
                  : 'Audio saved ✓'}
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${Math.round(audioUploadProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* ── Heading ── */}
        <div>
          <h2 className="text-white text-2xl font-extrabold tracking-tight">Add a photo?</h2>
          <p className="text-white/60 text-sm mt-0.5">
            A moment from your evening — completely optional
          </p>
        </div>

        {/* ── Photo picker ── */}
        <button
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center',
            'border-2 transition-all duration-200 active:scale-[0.98]',
            preview
              ? 'border-white/50 aspect-[4/3]'
              : 'border-dashed border-white/35 bg-white/10 hover:bg-white/15 aspect-[4/3]',
          )}
        >
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Selected photo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-bold">Change photo</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="text-4xl">📸</span>
              <p className="text-white/60 text-sm text-center max-w-[180px]">
                Tap to choose from your library
              </p>
            </div>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Choose photo"
        />

        {/* Auth nudge — shown only if user isn't signed in */}
        {!isSignedIn && (
          <p className="text-white/50 text-xs text-center">
            You&apos;ll create a free account when you save — takes 10 seconds
          </p>
        )}
      </div>

      {/* ── Pinned save button — ALWAYS visible, photo is optional ── */}
      <div className="shrink-0 px-5 pb-8  flex flex-col gap-3">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl font-extrabold text-base bg-white text-gray-900 shadow-lg active:scale-[0.98] transition-transform"
        >
          {photoFile ? 'Save evening →' : 'Save without photo →'}
        </button>

        {photoFile && (
          <button
            onClick={() => {
              setPhotoFile(null)
              setPreview(null)
            }}
            className="text-white/50 text-sm hover:text-white/70 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  )
}