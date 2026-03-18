'use client'

import BlobCharacter from './BlobCharacter'
import ProgressRing from './ProgressRing'
import type { Mood } from './types'

// ─── Upload bar ────────────────────────────────────────────────────────────────

function UploadBar({ label, progress }: { label: string; progress: number }) {
  const pct = Math.round(Math.min(1, progress) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-white/60 mb-1.5">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Uploading step ────────────────────────────────────────────────────────────

interface UploadingStepProps {
  audioProgress: number
  photoProgress: number
  mood: Mood
}

export function UploadingStep({ audioProgress, photoProgress, mood }: UploadingStepProps) {
  const overall = (audioProgress + photoProgress) / 2

  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-7">
      <div className="w-[150px] animate-[bounce-gentle_2.4s_ease-in-out_infinite]">
        <BlobCharacter mood={mood} />
      </div>

      <div className="text-center">
        <h2 className="text-white text-2xl font-extrabold tracking-tight">
          Saving your evening…
        </h2>
        <p className="text-white/60 text-sm mt-1">Almost there</p>
      </div>

      <div className="w-full space-y-4">
        <UploadBar label="Audio" progress={audioProgress} />
        <UploadBar label="Photo"  progress={photoProgress} />
      </div>

      <div className="relative flex items-center justify-center">
        <ProgressRing progress={overall} size={80} strokeWidth={6} />
        <span className="absolute text-white font-bold text-lg">
          {Math.round(overall * 100)}%
        </span>
      </div>
    </div>
  )
}

// ─── Done step ─────────────────────────────────────────────────────────────────

export function DoneStep({ mood }: { mood: Mood }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-6 text-center">
      <div className="w-[180px]">
        <BlobCharacter mood={mood} />
      </div>

      <div>
        <h2 className="text-white text-3xl font-extrabold tracking-tight">
          Evening captured ✓
        </h2>
        <p className="text-white/70 text-sm mt-2 max-w-[240px] mx-auto">
          Your recording is being processed. Check back soon for insights.
        </p>
      </div>
    </div>
  )
}