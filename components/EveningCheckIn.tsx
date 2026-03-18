'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MoodId =
  | 'happy' | 'excited' | 'anxious' | 'calm'
  | 'sad' | 'tired' | 'grateful' | 'reflective'

export type Step = 'mood' | 'record' | 'photo' | 'uploading' | 'done'

interface Mood {
  id: MoodId
  label: string
  emoji: string
  bg: string
  blobFill: string
  topFill: string
  pillAccent: string
  pillText: string
  eyeStyle: EyeStyle
  mouthStyle: MouthStyle
  accessory?: AccessoryType
}

type EyeStyle = 'wide' | 'excited' | 'worried' | 'peaceful' | 'sad' | 'sleepy' | 'warm' | 'pensive'
type MouthStyle = 'bigGrin' | 'openJoy' | 'wobbly' | 'serene' | 'downturn' | 'flat' | 'soft' | 'pursed'
type AccessoryType = 'stars' | 'sweat' | 'zzz' | 'heart' | 'sparkle'

export interface CheckInData {
  mood: MoodId
  audioBlob: Blob
  photoFile?: File
}

// ─── Mood Data ─────────────────────────────────────────────────────────────────

const MOODS: Mood[] = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😄',
    bg: 'from-[#F5C842] to-[#F08030]',
    blobFill: '#F5C842',
    topFill: '#E8702A',
    pillAccent: '#F5C842',
    pillText: '#7A4800',
    eyeStyle: 'wide',
    mouthStyle: 'bigGrin',
    accessory: 'stars',
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🤩',
    bg: 'from-[#FF6B35] to-[#D93A5A]',
    blobFill: '#FF6B35',
    topFill: '#D93A5A',
    pillAccent: '#FF6B35',
    pillText: '#7A1520',
    eyeStyle: 'excited',
    mouthStyle: 'openJoy',
    accessory: 'sparkle',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    bg: 'from-[#4A7FC1] to-[#2D5A9E]',
    blobFill: '#5B8DD9',
    topFill: '#2D5A9E',
    pillAccent: '#5B8DD9',
    pillText: '#0A1F4A',
    eyeStyle: 'worried',
    mouthStyle: 'wobbly',
    accessory: 'sweat',
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    bg: 'from-[#4EC49A] to-[#2E9E74]',
    blobFill: '#5EC49A',
    topFill: '#2E9E74',
    pillAccent: '#5EC49A',
    pillText: '#0A3D28',
    eyeStyle: 'peaceful',
    mouthStyle: 'serene',
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😔',
    bg: 'from-[#6B80C0] to-[#3D4F8A]',
    blobFill: '#7B90D4',
    topFill: '#3D4F8A',
    pillAccent: '#7B90D4',
    pillText: '#0E1535',
    eyeStyle: 'sad',
    mouthStyle: 'downturn',
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😴',
    bg: 'from-[#9B7EC8] to-[#6A50A0]',
    blobFill: '#B090DC',
    topFill: '#6A50A0',
    pillAccent: '#9B7EC8',
    pillText: '#1E0A40',
    eyeStyle: 'sleepy',
    mouthStyle: 'flat',
    accessory: 'zzz',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🥰',
    bg: 'from-[#E8768A] to-[#C04A6A]',
    blobFill: '#F090A4',
    topFill: '#C04A6A',
    pillAccent: '#E8768A',
    pillText: '#5A0A22',
    eyeStyle: 'warm',
    mouthStyle: 'soft',
    accessory: 'heart',
  },
  {
    id: 'reflective',
    label: 'Reflective',
    emoji: '🤔',
    bg: 'from-[#6A8C9C] to-[#3E5C6A]',
    blobFill: '#8AAAB8',
    topFill: '#3E5C6A',
    pillAccent: '#8AAAB8',
    pillText: '#0A1E28',
    eyeStyle: 'pensive',
    mouthStyle: 'pursed',
  },
]

// ─── Blob Character ────────────────────────────────────────────────────────────

function BlobCharacter({ mood }: { mood: Mood }) {
  // Eye rendering helpers
  const eyeRy: Record<EyeStyle, [number, number]> = {
    wide:      [22, 26],
    excited:   [20, 22],
    worried:   [14, 16],
    peaceful:  [10, 12],
    sad:       [13, 14],
    sleepy:    [7,  9 ],
    warm:      [19, 21],
    pensive:   [14, 16],
  }
  const eyeCy: Record<EyeStyle, number> = {
    wide: 176, excited: 174, worried: 178, peaceful: 182,
    sad: 182, sleepy: 186, warm: 175, pensive: 178,
  }

  // Mouth path helpers
  const mouthPaths: Record<MouthStyle, string> = {
    bigGrin:  'M168 235 Q210 278 252 235',
    openJoy:  'M170 232 Q210 268 250 232',
    wobbly:   'M174 248 Q192 242 210 248 Q228 254 246 248',
    serene:   'M176 244 Q210 258 244 244',
    downturn: 'M174 258 Q210 240 246 258',
    flat:     'M180 248 L240 248',
    soft:     'M175 240 Q210 262 245 240',
    pursed:   'M183 247 Q210 252 237 247',
  }

  const [ry1, ry2] = eyeRy[mood.eyeStyle]
  const cy = eyeCy[mood.eyeStyle]
  const mPath = mouthPaths[mood.mouthStyle]
  const isFilled = mood.mouthStyle === 'bigGrin' || mood.mouthStyle === 'openJoy'

  return (
    <svg
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {/* Blob body */}
      <ellipse cx="210" cy="290" rx="155" ry="155" fill={mood.blobFill} />

      {/* Scalloped top cap */}
      <path
        d={[
          'M55 250',
          'Q72 215 90 250',
          'Q107 215 125 250',
          'Q142 215 160 250',
          'Q177 215 195 250',
          'Q212 215 230 250',
          'Q247 215 265 250',
          'Q282 215 300 250',
          'Q317 215 335 250',
          'Q352 215 365 250',
          'L365 130 Q210 40 55 130 Z',
        ].join(' ')}
        fill={mood.topFill}
        opacity="0.75"
      />

      {/* ── Accessories ── */}

      {mood.accessory === 'stars' && (
        <>
          {([[82, 128, 14], [338, 112, 11], [62, 200, 9]] as [number,number,number][]).map(([x,y,r], i) => (
            <polygon key={i}
              points={starPath(x, y, r, r * 0.42, 5)}
              fill="white" opacity={0.9 - i * 0.22}
            />
          ))}
        </>
      )}

      {mood.accessory === 'sparkle' && (
        <>
          <text x="76"  y="158" fontSize="26" fill="white" opacity="0.9" fontFamily="sans-serif">✦</text>
          <text x="336" y="145" fontSize="20" fill="white" opacity="0.7" fontFamily="sans-serif">✦</text>
          <text x="310" y="200" fontSize="13" fill="white" opacity="0.55" fontFamily="sans-serif">✦</text>
        </>
      )}

      {mood.accessory === 'sweat' && (
        <>
          {/* Headband */}
          <rect x="90" y="142" width="240" height="30" rx="15" fill="white" opacity="0.88" />
          <rect x="90" y="149" width="240" height="6"  rx="0" fill={mood.topFill} opacity="0.45" />
          <rect x="90" y="158" width="240" height="6"  rx="0" fill={mood.blobFill} opacity="0.4" />
          {/* Drops */}
          <ellipse cx="318" cy="192" rx="9"  ry="13" fill="#4FC3F7" />
          <ellipse cx="334" cy="213" rx="7"  ry="10" fill="#4FC3F7" opacity="0.75" />
        </>
      )}

      {mood.accessory === 'zzz' && (
        <>
          <text x="320" y="162" fontSize="24" fontWeight="700" fill="white" opacity="0.85" fontFamily="sans-serif">z</text>
          <text x="340" y="140" fontSize="19" fontWeight="700" fill="white" opacity="0.65" fontFamily="sans-serif">z</text>
          <text x="356" y="122" fontSize="14" fontWeight="700" fill="white" opacity="0.45" fontFamily="sans-serif">z</text>
        </>
      )}

      {mood.accessory === 'heart' && (
        <path
          d="M330 132 C330 120,318 110,306 114 C292 110,280 120,280 132 C280 154,305 170,305 170 C305 170,330 154,330 132 Z"
          fill="white" opacity="0.9"
        />
      )}

      {/* ── Eyes ── */}

      {/* Whites */}
      <ellipse cx="175" cy={cy} rx="22" ry={ry1} fill="white" />
      <ellipse cx="245" cy={mood.eyeStyle === 'pensive' ? cy - 2 : cy} rx="22" ry={ry2} fill="white" />

      {/* Irises */}
      <circle cx="175" cy={cy + 2} r="11" fill="#1a1a2e" />
      <circle cx="245" cy={mood.eyeStyle === 'pensive' ? cy : cy + 2} r="11" fill="#1a1a2e" />

      {/* Shine dots */}
      <circle cx="179" cy={cy - 1} r="4" fill="white" opacity="0.7" />
      <circle cx="249" cy={mood.eyeStyle === 'pensive' ? cy - 3 : cy - 1} r="4" fill="white" opacity="0.7" />

      {/* Worried brows */}
      {mood.eyeStyle === 'worried' && (
        <>
          <path d="M153 160 Q175 150 197 156" stroke="#1a1a2e" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M223 156 Q245 150 267 160" stroke="#1a1a2e" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Sad brows */}
      {mood.eyeStyle === 'sad' && (
        <>
          <path d="M157 164 Q175 157 193 163" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round"
            transform="rotate(10 175 160)" />
          <path d="M227 163 Q245 157 263 164" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round"
            transform="rotate(-10 245 160)" />
        </>
      )}

      {/* Sleepy lids */}
      {mood.eyeStyle === 'sleepy' && (
        <>
          <rect x="153" y={cy - 4} width="44" height="12" rx="6" fill={mood.blobFill} />
          <rect x="223" y={cy - 4} width="44" height="12" rx="6" fill={mood.blobFill} />
        </>
      )}

      {/* ── Mouth ── */}
      {isFilled ? (
        <>
          <path d={mPath} fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          {/* Teeth */}
          {mood.mouthStyle === 'bigGrin' && (
            <>
              <rect x="195" y="242" width="13" height="16" rx="4" fill="white" />
              <rect x="212" y="242" width="13" height="16" rx="4" fill="white" />
            </>
          )}
        </>
      ) : (
        <path
          d={mPath}
          stroke="#1a1a2e"
          strokeWidth={mood.mouthStyle === 'downturn' ? 4.5 : 4}
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Blush for warm/grateful */}
      {mood.eyeStyle === 'warm' && (
        <>
          <ellipse cx="148" cy="210" rx="18" ry="10" fill={mood.topFill} opacity="0.4" />
          <ellipse cx="272" cy="210" rx="18" ry="10" fill={mood.topFill} opacity="0.4" />
        </>
      )}
    </svg>
  )
}

function starPath(cx: number, cy: number, r: number, ir: number, n: number): string {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2
    const rad = i % 2 === 0 ? r : ir
    return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`
  }).join(' ')
}

// ─── Step 1: Mood ──────────────────────────────────────────────────────────────

function MoodStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: MoodId | null
  onSelect: (id: MoodId) => void
  onNext: () => void
}) {
  const mood = MOODS.find(m => m.id === selected) ?? MOODS[0]

  return (
    <div className="flex flex-col h-full">
      {/* Character — takes up ~55% */}
      <div className="flex-1 flex items-end justify-center pb-2 px-6">
        <div
          className="w-full max-w-[300px] transition-all duration-500 ease-out"
          style={{ filter: selected ? 'none' : 'grayscale(0.3) opacity(0.6)' }}
        >
          <BlobCharacter mood={selected ? mood : MOODS[0]} />
        </div>
      </div>

      {/* Text + pills */}
      <div className="px-6 pb-8">
        <h1 className="text-white text-[28px] font-bold leading-tight mb-1">
          How was your evening?
        </h1>
        <p className="text-white/70 text-sm mb-5">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        {/* Mood pills grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {MOODS.map(m => {
            const isSelected = selected === m.id
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className={cn(
                  'py-2 px-1 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95',
                  'border border-white/20',
                  isSelected
                    ? 'scale-105 shadow-lg'
                    : 'bg-white/15 text-white hover:bg-white/25',
                )}
                style={
                  isSelected
                    ? { background: m.pillAccent, color: m.pillText, borderColor: 'transparent' }
                    : {}
                }
              >
                {m.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={onNext}
          disabled={!selected}
          className={cn(
            'w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98]',
            selected
              ? 'bg-white text-gray-900 shadow-lg'
              : 'bg-white/20 text-white/50 cursor-not-allowed',
          )}
        >
          {selected ? `Feeling ${mood.label.toLowerCase()} — let's record →` : 'Pick a mood first'}
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Record ────────────────────────────────────────────────────────────

function RecordStep({
  isRecording,
  secondsElapsed,
  maxSeconds,
  onStart,
  onStop,
  mood,
}: {
  isRecording: boolean
  secondsElapsed: number
  maxSeconds: number
  onStart: () => void
  onStop: () => void
  mood: Mood
}) {
  const remaining = maxSeconds - secondsElapsed
  const progress = secondsElapsed / maxSeconds

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Small blob preview */}
      <div className="flex justify-center pt-6 pb-2 px-6">
        <div className="w-[140px] opacity-80">
          <BlobCharacter mood={mood} />
        </div>
      </div>

      {/* Center recording UI */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">
            {isRecording ? 'Recording your evening...' : 'Ready to capture your day?'}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {isRecording ? 'Tap stop when you\'re done' : 'Speak freely — no pressure'}
          </p>
        </div>

        {/* Waveform */}
        <div className="flex items-center justify-center gap-[3px] h-12 w-full max-w-[280px]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-white transition-all duration-150"
              style={{
                height: isRecording
                  ? `${8 + Math.abs(Math.sin((Date.now() / 200 + i * 0.4))) * 32}px`
                  : '4px',
                opacity: isRecording ? 0.9 : 0.3,
                animationName: isRecording ? 'waveBar' : 'none',
                animationDuration: `${350 + (i * 73) % 350}ms`,
                animationDelay: `${(i * 37) % 500}ms`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                animationDirection: 'alternate',
              }}
            />
          ))}
        </div>

        {/* Timer ring */}
        <div className="relative flex items-center justify-center">
          <ProgressRing progress={progress} size={100} stroke={5} />
          <div className="absolute text-center">
            <p className="text-white text-xl font-mono font-bold">{fmt(remaining)}</p>
            <p className="text-white/50 text-[10px]">remaining</p>
          </div>
        </div>

        {/* Record / Stop button */}
        <button
          onClick={isRecording ? onStop : onStart}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90',
            'border-4 border-white shadow-xl',
            isRecording ? 'bg-white' : 'bg-transparent',
          )}
        >
          {isRecording ? (
            <div className="w-7 h-7 rounded-sm bg-gray-900" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white" />
          )}
        </button>

        {isRecording && (
          <p className="text-white/50 text-xs animate-pulse">● REC {fmt(secondsElapsed)}</p>
        )}
      </div>
    </div>
  )
}

// ─── Step 3: Photo ─────────────────────────────────────────────────────────────

function PhotoStep({
  audioUploadProgress,
  isAudioUploading,
  onPhotoSelected,
  onSkip,
  mood,
}: {
  audioUploadProgress: number
  isAudioUploading: boolean
  onPhotoSelected: (file: File) => void
  onSkip: () => void
  mood: Mood
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div className="flex flex-col h-full px-6 pb-8">
      {/* Audio upload indicator */}
      <div className="pt-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('w-2 h-2 rounded-full', isAudioUploading ? 'bg-yellow-300 animate-pulse' : 'bg-green-400')} />
          <span className="text-white/70 text-xs">
            {isAudioUploading
              ? `Saving audio — ${Math.round(audioUploadProgress * 100)}%`
              : 'Audio saved ✓'}
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${Math.round(audioUploadProgress * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">Add a photo?</h2>
          <p className="text-white/60 text-sm mt-1">A moment from your evening — totally optional</p>
        </div>

        {/* Photo preview / picker */}
        <button
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-56 h-56 rounded-3xl overflow-hidden flex flex-col items-center justify-center',
            'border-2 border-dashed border-white/40 transition-all duration-200 active:scale-95',
            preview ? 'border-solid border-white/60' : 'bg-white/10 hover:bg-white/15',
          )}
        >
          {preview ? (
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Selected" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold">Change photo</span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📸</div>
              <p className="text-white/60 text-xs text-center px-4">Tap to take a photo or choose one</p>
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {photoFile && (
          <button
            onClick={() => onPhotoSelected(photoFile)}
            className="w-full py-4 rounded-2xl font-bold text-base bg-white text-gray-900 shadow-lg active:scale-[0.98] transition-transform"
          >
            Save evening →
          </button>
        )}
        <button
          onClick={onSkip}
          className="w-full py-3 rounded-2xl font-semibold text-sm text-white/60 hover:text-white/80 transition-colors"
        >
          Skip photo
        </button>
      </div>
    </div>
  )
}

// ─── Step: Uploading ───────────────────────────────────────────────────────────

function UploadingStep({
  audioProgress,
  photoProgress,
  mood,
}: {
  audioProgress: number
  photoProgress: number
  mood: Mood
}) {
  const overall = Math.round(((audioProgress + photoProgress) / 2) * 100)

  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-6">
      <div className="w-[160px] opacity-90 animate-bounce-gentle">
        <BlobCharacter mood={mood} />
      </div>

      <div className="text-center">
        <h2 className="text-white text-2xl font-bold">Saving your evening...</h2>
        <p className="text-white/60 text-sm mt-1">Almost there</p>
      </div>

      <div className="w-full space-y-3">
        <UploadBar label="Audio" progress={audioProgress} />
        <UploadBar label="Photo" progress={photoProgress} />
      </div>

      <div className="relative">
        <ProgressRing progress={(audioProgress + photoProgress) / 2} size={80} stroke={6} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{overall}%</span>
        </div>
      </div>
    </div>
  )
}

function UploadBar({ label, progress }: { label: string; progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span>{label}</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  )
}

// ─── Step: Done ────────────────────────────────────────────────────────────────

function DoneStep({ mood }: { mood: Mood }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-6 text-center">
      <div className="w-[180px]">
        <BlobCharacter mood={mood} />
      </div>
      <div>
        <h2 className="text-white text-3xl font-bold">Evening captured ✓</h2>
        <p className="text-white/70 text-sm mt-2">
          Your recording is being processed. Check back soon for insights.
        </p>
      </div>
    </div>
  )
}

// ─── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({
  progress, size = 72, stroke = 5,
}: {
  progress: number; size?: number; stroke?: number
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(1, progress))
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="white" strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export interface EveningCheckInRecorderProps {
  isRecording: boolean
  secondsElapsed: number
  maxSeconds: number
  onStartRecording: () => void
  onStopRecording: () => void
}

export interface EveningCheckInUploadProps {
  audioUploadProgress: number
  isAudioUploading: boolean
  photoUploadProgress: number
  isPhotoUploading: boolean
  isSaved: boolean
}

export interface EveningCheckInProps {
  recorder: EveningCheckInRecorderProps
  upload: EveningCheckInUploadProps
  onMoodSelected: (mood: MoodId) => void
  onRecordingDone: () => void   // called when user taps stop (signals parent to start audio upload)
  onPhotoSelected: (file: File) => void
  onSkipPhoto: () => void
  currentStep: Step
  onStepChange: (step: Step) => void
}

export default function EveningCheckIn({
  recorder,
  upload,
  onMoodSelected,
  onRecordingDone,
  onPhotoSelected,
  onSkipPhoto,
  currentStep,
  onStepChange,
}: EveningCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null)
  const mood = MOODS.find(m => m.id === selectedMood) ?? MOODS[0]

  const handleMoodSelect = (id: MoodId) => {
    setSelectedMood(id)
    onMoodSelected(id)
  }

  const handleMoodNext = () => {
    if (selectedMood) onStepChange('record')
  }

  const handleStop = () => {
    recorder.onStopRecording()
    onRecordingDone()          // tells page.tsx to kick off audio upload
    onStepChange('photo')
  }

  // Auto-advance to done once both uploads finish
  useEffect(() => {
    if (upload.isSaved && currentStep === 'photo') {
      onStepChange('done')
    }
  }, [upload.isSaved, currentStep, onStepChange])

  // Background gradient — interpolates between moods via CSS transition
  const bgStyle = selectedMood
    ? { background: `linear-gradient(160deg, ${mood.blobFill} 0%, ${mood.topFill} 100%)` }
    : { background: 'linear-gradient(160deg, #2d2d3a 0%, #1a1a28 100%)' }

  return (
    <div
      className="relative w-full h-[100dvh] max-w-[430px] mx-auto overflow-hidden flex flex-col"
      style={{ ...bgStyle, transition: 'background 0.6s ease' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2 shrink-0">
        <span className="text-white text-lg font-bold tracking-tight">Where My Evening Went</span>
        {currentStep !== 'mood' && currentStep !== 'done' && (
          <button
            onClick={() => onStepChange(currentStep === 'record' ? 'mood' : 'record')}
            className="text-white/60 text-sm hover:text-white/90 transition-colors"
          >
            ← back
          </button>
        )}
      </div>

      {/* Step indicator dots */}
      {currentStep !== 'done' && currentStep !== 'uploading' && (
        <div className="flex justify-center gap-2 pb-1 shrink-0">
          {(['mood', 'record', 'photo'] as Step[]).map((s, i) => {
            const steps: Step[] = ['mood', 'record', 'photo']
            const ci = steps.indexOf(currentStep)
            return (
              <div
                key={s}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === ci ? 'w-6 h-2 bg-white' :
                  i < ci  ? 'w-2 h-2 bg-white/60' :
                             'w-2 h-2 bg-white/25',
                )}
              />
            )
          })}
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 overflow-hidden">
        {currentStep === 'mood' && (
          <MoodStep
            selected={selectedMood}
            onSelect={handleMoodSelect}
            onNext={handleMoodNext}
          />
        )}

        {currentStep === 'record' && (
          <RecordStep
            isRecording={recorder.isRecording}
            secondsElapsed={recorder.secondsElapsed}
            maxSeconds={recorder.maxSeconds}
            onStart={recorder.onStartRecording}
            onStop={handleStop}
            mood={mood}
          />
        )}

        {currentStep === 'photo' && (
          <PhotoStep
            audioUploadProgress={upload.audioUploadProgress}
            isAudioUploading={upload.isAudioUploading}
            onPhotoSelected={onPhotoSelected}
            onSkip={onSkipPhoto}
            mood={mood}
          />
        )}

        {currentStep === 'uploading' && (
          <UploadingStep
            audioProgress={upload.audioUploadProgress}
            photoProgress={upload.photoUploadProgress}
            mood={mood}
          />
        )}

        {currentStep === 'done' && <DoneStep mood={mood} />}
      </div>
    </div>
  )
}