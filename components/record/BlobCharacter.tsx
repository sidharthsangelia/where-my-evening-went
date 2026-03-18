import type { Mood, EyeStyle, MouthStyle } from './types'

// ─── Lookup tables ─────────────────────────────────────────────────────────────
// [rx, ry] for each eye ellipse. ry controls how "open" the eye looks.
const EYE_RY: Record<EyeStyle, [number, number]> = {
  wide:     [22, 26],
  excited:  [20, 22],
  worried:  [14, 16],
  peaceful: [10, 12],
  sad:      [13, 14],
  sleepy:   [6,  8 ],
  warm:     [19, 21],
  pensive:  [14, 16],
}

// cy for the eye center — varies by mood to shift gaze subtly
const EYE_CY: Record<EyeStyle, number> = {
  wide: 176, excited: 174, worried: 178, peaceful: 182,
  sad: 182,  sleepy: 186,  warm: 175,   pensive: 178,
}

// SVG path strings. Q = quadratic bezier (start, control-point, end).
// Moving control point UP = smile, DOWN = frown. Straight L = flat.
const MOUTH_PATHS: Record<MouthStyle, string> = {
  bigGrin:  'M168 235 Q210 278 252 235',
  openJoy:  'M170 232 Q210 268 250 232',
  wobbly:   'M174 248 Q192 242 210 248 Q228 254 246 248',
  serene:   'M176 244 Q210 258 244 244',
  downturn: 'M174 258 Q210 240 246 258',
  flat:     'M180 248 L240 248',
  soft:     'M175 240 Q210 262 245 240',
  pursed:   'M183 247 Q210 252 237 247',
}

// Filled mouths get a solid shape + optional teeth
const FILLED_MOUTHS: MouthStyle[] = ['bigGrin', 'openJoy']

// ─── Helpers ───────────────────────────────────────────────────────────────────

function starPath(cx: number, cy: number, r: number, ir: number, n: number): string {
  return Array.from({ length: n * 2 }, (_, i) => {
    const angle = (i * Math.PI) / n - Math.PI / 2
    const radius = i % 2 === 0 ? r : ir
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`
  }).join(' ')
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Accessory({ mood }: { mood: Mood }) {
  switch (mood.accessory) {
    case 'stars':
      return (
        <>
          {([[82, 128, 14], [338, 112, 11], [62, 200, 9]] as [number, number, number][]).map(
            ([x, y, r], i) => (
              <polygon key={i} points={starPath(x, y, r, r * 0.42, 5)}
                fill="white" opacity={0.9 - i * 0.22} />
            ),
          )}
        </>
      )
    case 'sparkle':
      return (
        <>
          <text x="76"  y="158" fontSize="26" fill="white" opacity="0.9"  fontFamily="sans-serif">✦</text>
          <text x="336" y="145" fontSize="20" fill="white" opacity="0.7"  fontFamily="sans-serif">✦</text>
          <text x="310" y="200" fontSize="13" fill="white" opacity="0.55" fontFamily="sans-serif">✦</text>
        </>
      )
    case 'sweat':
      return (
        <>
          <rect x="90" y="142" width="240" height="30" rx="15" fill="white" opacity="0.88" />
          <rect x="90" y="149" width="240" height="6"  fill={mood.topFill}  opacity="0.45" />
          <rect x="90" y="158" width="240" height="6"  fill={mood.blobFill} opacity="0.4"  />
          <ellipse cx="318" cy="192" rx="9"  ry="13" fill="#4FC3F7" />
          <ellipse cx="334" cy="213" rx="7"  ry="10" fill="#4FC3F7" opacity="0.75" />
        </>
      )
    case 'zzz':
      return (
        <>
          <text x="320" y="162" fontSize="24" fontWeight="700" fill="white" opacity="0.85" fontFamily="sans-serif">z</text>
          <text x="340" y="140" fontSize="19" fontWeight="700" fill="white" opacity="0.65" fontFamily="sans-serif">z</text>
          <text x="356" y="122" fontSize="14" fontWeight="700" fill="white" opacity="0.45" fontFamily="sans-serif">z</text>
        </>
      )
    case 'heart':
      return (
        <path
          d="M330 132 C330 120,318 110,306 114 C292 110,280 120,280 132 C280 154,305 170,305 170 C305 170,330 154,330 132 Z"
          fill="white" opacity="0.9"
        />
      )
    default:
      return null
  }
}

function Eyes({ eyeStyle, blobFill }: { eyeStyle: EyeStyle; blobFill: string }) {
  const [rx, ry] = EYE_RY[eyeStyle]
  const cy = EYE_CY[eyeStyle]
  const lx = 175
  const rx2 = eyeStyle === 'pensive' ? 248 : 245

  return (
    <>
      {/* Whites */}
      <ellipse cx={lx}  cy={cy} rx={rx} ry={ry} fill="white" />
      <ellipse cx={rx2} cy={eyeStyle === 'pensive' ? cy - 2 : cy} rx={rx} ry={ry} fill="white" />

      {/* Pupils */}
      <circle cx={lx}  cy={cy + 2} r={11} fill="#1a1a2e" />
      <circle cx={rx2} cy={eyeStyle === 'pensive' ? cy : cy + 2} r={11} fill="#1a1a2e" />

      {/* Shine */}
      <circle cx={lx + 4}  cy={cy - 1} r={4} fill="white" opacity="0.7" />
      <circle cx={rx2 + 4} cy={eyeStyle === 'pensive' ? cy - 3 : cy - 1} r={4} fill="white" opacity="0.7" />

      {/* Worried brows */}
      {eyeStyle === 'worried' && (
        <>
          <path d="M153 160 Q175 150 197 156" stroke="#1a1a2e" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M223 156 Q245 150 267 160" stroke="#1a1a2e" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Sad brows */}
      {eyeStyle === 'sad' && (
        <>
          <path d="M157 164 Q175 157 193 163" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round" transform="rotate(10 175 160)" />
          <path d="M227 163 Q245 157 263 164" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round" transform="rotate(-10 245 160)" />
        </>
      )}

      {/* Sleepy lids — a rect that covers the top half of the eye */}
      {eyeStyle === 'sleepy' && (
        <>
          <rect x="153" y={cy - 6} width="44" height="14" rx="6" fill={blobFill} />
          <rect x="223" y={cy - 6} width="44" height="14" rx="6" fill={blobFill} />
        </>
      )}
    </>
  )
}

function Mouth({ mouthStyle, blobFill }: { mouthStyle: MouthStyle; blobFill: string }) {
  const path = MOUTH_PATHS[mouthStyle]
  const isFilled = FILLED_MOUTHS.includes(mouthStyle)

  if (isFilled) {
    return (
      <>
        <path d={path} fill="#1a1a2e" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
        {mouthStyle === 'bigGrin' && (
          <>
            <rect x="195" y="243" width="13" height="16" rx="4" fill="white" />
            <rect x="212" y="243" width="13" height="16" rx="4" fill="white" />
          </>
        )}
      </>
    )
  }

  return (
    <path
      d={path}
      stroke="#1a1a2e"
      strokeWidth={mouthStyle === 'downturn' ? 4.5 : 4}
      fill="none"
      strokeLinecap="round"
    />
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function BlobCharacter({ mood }: { mood: Mood }) {
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
        d={`M55 250 Q72 215 90 250 Q107 215 125 250 Q142 215 160 250
            Q177 215 195 250 Q212 215 230 250 Q247 215 265 250
            Q282 215 300 250 Q317 215 335 250 Q352 215 365 250
            L365 130 Q210 40 55 130 Z`}
        fill={mood.topFill}
        opacity="0.75"
      />

      <Accessory mood={mood} />

      <Eyes eyeStyle={mood.eyeStyle} blobFill={mood.blobFill} />

      <Mouth mouthStyle={mood.mouthStyle} blobFill={mood.blobFill} />

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