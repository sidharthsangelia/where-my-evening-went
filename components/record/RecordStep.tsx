'use client'

import { cn } from '@/lib/utils'
import BlobCharacter from './BlobCharacter'
import ProgressRing from './ProgressRing'
import type { Mood, RecorderProps } from './types'

interface RecordStepProps {
  recorder: RecorderProps
  mood: Mood
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Animated bars — heights driven by CSS animation, not JS RAF
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-14 w-full max-w-[280px] mx-auto">
      {Array.from({ length: 36 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-white"
          style={{
            height: active ? `${8 + (i * 17 + 5) % 40}px` : '4px',
            opacity: active ? 0.85 : 0.3,
            animationName: active ? 'waveBar' : 'none',
            animationDuration: `${350 + (i * 73) % 350}ms`,
            animationDelay: `${(i * 37) % 500}ms`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            animationDirection: 'alternate',
            transition: 'height 0.3s ease, opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

export default function RecordStep({ recorder, mood }: RecordStepProps) {
  const { isRecording, secondsElapsed, maxSeconds, onStartRecording, onStopRecording } = recorder
  const remaining = maxSeconds - secondsElapsed
  const progress = secondsElapsed / maxSeconds

  return (
    /*
     * Layout: flex column, content centered, button pinned to bottom.
     * sticky bottom-0 ensures the button is always reachable without scroll.
     */
    <div className="flex flex-col h-full ">
      {/* Scrollable content */}
      <div className=" overflow-y-auto flex flex-col items-center justify-center px-6 gap-4 py-6 ">
        {/* Compact blob */}
        <div className="w-30  opacity-90">
          <BlobCharacter mood={mood} />
        </div>

        <div className="text-center ">
          <h2 className="text-white text-2xl font-extrabold tracking-tight">
            {isRecording ? 'Recording your evening…' : 'Ready when you are'}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {isRecording ? 'Tap stop when you\'re done' : 'Speak freely — no edits, no pressure'}
          </p>
        </div>

        <Waveform active={isRecording} />

        {/* Timer ring */}
        <div className="relative flex items-center justify-center">
          <ProgressRing progress={progress} size={96} strokeWidth={5} />
          <div className="absolute text-center">
            <p className="text-white text-lg font-mono font-bold">{formatTime(remaining)}</p>
            <p className="text-white/40 text-[10px] leading-none">left</p>
          </div>
        </div>

        {isRecording && (
          <p className="text-white/50 text-xs tracking-widest animate-pulse">
            ● REC {formatTime(secondsElapsed)}
          </p>
        )}
      </div>

      {/* ── Pinned bottom button — always visible ── */}
      <div className="shrink-0 px-5 pb-8 pt-3">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={cn(
            'w-full py-5 rounded-2xl font-extrabold text-base',
            'flex items-center justify-center gap-3',
            'transition-all duration-200 active:scale-[0.97]',
            isRecording
              ? 'bg-white text-gray-900 shadow-lg'
              : 'bg-white text-gray-900 shadow-lg',
          )}
        >
          {isRecording ? (
            <>
              <span className="w-4 h-4 rounded-sm bg-gray-900 shrink-0" />
              Stop recording
            </>
          ) : (
            <>
              <span className="w-4 h-4 rounded-full bg-red-500 shrink-0 animate-pulse" />
              Start recording
            </>
          )}
        </button>
      </div>
    </div>
  )
}