import Link from "next/link";
import {
  moodEmoji, formatDateFull, formatDuration, extractPullQuote,
  getAlignment, alignmentConfig, themeRotation,
} from "./helpers";
import { Mic } from "lucide-react";
 

type Entry = {
  id: string;
  userMood: string | null;
  vibe: string | null;
  alignment: string | null;
  durationSeconds: number | null;
  transcript: string | null;
  themes: string[];
  insight: string | null;
  createdAt: Date;
};

export default function FeaturedCard({ entry, index }: { entry: Entry; index: number }) {
  const mood      = entry.userMood ?? entry.vibe ?? "";
  const emoji     = moodEmoji(mood);
  const pullQuote = extractPullQuote(entry.transcript);
  const alignKey  = getAlignment(entry.alignment);
  const alignCfg  = alignKey ? alignmentConfig[alignKey] : null;
  const duration  = formatDuration(entry.durationSeconds);

  // Alternate card tilt for visual rhythm
  const tilt = index === 1 ? "rotate-[0.4deg]" : index === 2 ? "-rotate-[0.3deg]" : "";

  return (
    <Link href={`/archive/${entry.id}`}>
      <div
        className={`relative rounded-[20px] p-5 overflow-hidden active:scale-[0.98] transition-transform ${tilt}`}
        style={{
          background: "var(--card)",
          border: "1px solid var(--color-neutral-200)",
          boxShadow: "0 2px 16px 0 rgba(98,17,0,0.06)",
        }}
      >
        {/* Ambient emoji watermark */}
        <div
          className="absolute -top-3 -right-2 text-[80px] leading-none select-none pointer-events-none"
          style={{ opacity: 0.07 }}
          aria-hidden
        >
          {emoji}
        </div>

        {/* Top row — date + alignment */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[10px] font-black uppercase tracking-[0.18em]"
            style={{ color: "var(--color-neutral-500)" }}
          >
            {formatDateFull(entry.createdAt)}
          </span>

          {alignCfg && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: alignCfg.bg }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: alignCfg.dot }}
              />
              <span
                className="text-[9px] font-black uppercase tracking-[0.15em]"
                style={{ color: alignCfg.text }}
              >
                {alignCfg.label}
              </span>
            </div>
          )}
        </div>

        {/* Mood */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-3xl leading-none">{emoji}</span>
          <span
            className="text-[22px] font-bold capitalize leading-tight"
            style={{
              color: "var(--color-neutral-900)",
              fontFamily: "var(--font-display)",
            }}
          >
            {mood || "Something"}
          </span>
        </div>

        {/* Pull quote */}
        {pullQuote && (
          <p
            className="text-[14px] leading-[1.6] mb-4 italic"
            style={{
              color: "var(--color-neutral-700)",
              fontFamily: "var(--font-display)",
            }}
          >
            "{pullQuote}"
          </p>
        )}

        {/* Themes */}
        {entry.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.themes.slice(0, 4).map((t, i) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize inline-block"
                style={{
                //   transform: `rotate(${themeRotation(i)}deg)`,
                  background: i % 2 === 0
                    ? "var(--color-secondary-light, #f3d98e)"
                    : "var(--color-neutral-100)",
                  color: "var(--color-neutral-800)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer — duration + cta */}
        <div className="flex items-center justify-between mt-2 pt-3"
          style={{ borderTop: "1px solid var(--color-neutral-100)" }}
        >
          {duration && (
            <span
              className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
              style={{ color: "var(--color-neutral-400)" }}
            >
              <Mic/> {duration} 
            </span> 
          )}
          <span
            className="text-[11px] font-bold uppercase tracking-[0.12em] ml-auto"
            style={{ color: "var(--color-primary)" }}
          >
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}