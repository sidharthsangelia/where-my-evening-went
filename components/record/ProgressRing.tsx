// Pure SVG progress ring. No dependencies.
// CSS transition handles animation — no JS animation loop needed.

interface ProgressRingProps {
  /** 0–1 */
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ProgressRing({
  progress,
  size = 72,
  strokeWidth = 5,
  className,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <svg
      width={size}
      height={size}
      className={className}
      // rotate so progress starts at 12 o'clock
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={strokeWidth}
      />
      {/* Fill */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.35s ease' }}
      />
    </svg>
  )
}