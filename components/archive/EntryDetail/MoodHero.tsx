import { moodEmoji, formatDate, formatTime, getAlignment, alignmentConfig } from "./helpers";

interface Props {
  userMood: string | null;
  vibe: string | null;
  alignment: string | null;
  createdAt: Date;
}

export default function MoodHero({ userMood, vibe, alignment, createdAt }: Props) {
  const mood      = userMood ?? vibe ?? "something";
  const emoji     = moodEmoji(mood);
  const alignKey  = getAlignment(alignment);
  const alignCfg  = alignKey ? alignmentConfig[alignKey] : null;

  return (
    <div className="relative px-5 pt-10 pb-8 overflow-hidden">
      {/* Giant ambient emoji */}
      <div
        className="absolute -top-2 -right-4 text-[120px] leading-none select-none pointer-events-none"
        style={{ opacity: 0.1, filter: "grayscale(0.3)" }}
        aria-hidden
      >
        {emoji}
      </div>

      {/* Date stamp — rotated label feel */}
      <div className="mb-5 inline-flex items-center gap-2">
        <span
          className="text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ color: "var(--color-neutral-500)" }}
        >
          {formatDate(createdAt)}
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--color-neutral-400)" }}
        >
          · {formatTime(createdAt)}
        </span>
      </div>

      {/* Mood headline */}
      <div className="flex flex-col gap-1">
        <span className="text-5xl leading-none mb-2" role="img" aria-label={mood}>
          {emoji}
        </span>
        <h1
          className="text-[38px] font-bold leading-[1.1] tracking-tight capitalize"
          style={{ color: "var(--color-neutral-900)", fontFamily: "var(--font-display)" }}
        >
          Feeling<br />
          <em className="not-italic" style={{ color: "var(--color-primary)" }}>
            {mood}
          </em>
        </h1>
      </div>

      {/* Vibe vs mood divergence row */}
      {vibe && userMood && vibe !== userMood && (
        <div className="flex items-center gap-2 mt-4">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-neutral-500)" }}
          >
            AI sensed
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize"
            style={{
              background: "var(--color-secondary-light, #f3d98e)",
              color: "var(--color-neutral-800)",
            }}
          >
            {vibe}
          </span>
          <span style={{ color: "var(--color-neutral-400)", fontSize: 14 }}>≠</span>
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
            }}
          >
            {userMood}
          </span>
        </div>
      )}

      {/* Alignment badge */}
      {alignCfg && (
        <div
          className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full"
          style={{ background: alignCfg.bg }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: alignCfg.dot }}
          />
          <span
            className="text-[10px] font-black uppercase tracking-[0.15em]"
            style={{ color: alignCfg.text }}
          >
            {alignCfg.label}
          </span>
        </div>
      )}
    </div>
  );
}