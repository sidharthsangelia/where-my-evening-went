import Link from "next/link";
import AudioPlayer from "../AudioPlayer";
import { getDayEntry } from "@/actions/entry";
import { ProcessingCard, FailedCard } from "./StatusCards";
import { formatTime, extractPullQuote, moodEmoji, alignmentStyle } from "./helpers";

type Entry = NonNullable<Awaited<ReturnType<typeof getDayEntry>>>;

export default function EntryPreview({ entry }: { entry: Entry }) {
  if (entry.status === "PROCESSING" || entry.status === "UPLOADED") {
    return <ProcessingCard />;
  }
  if (entry.status === "FAILED") {
    return <FailedCard />;
  }

  const mood      = entry.userMood ?? entry.vibe ?? "";
  const emoji     = moodEmoji(mood);
  const pullQuote = extractPullQuote(entry.transcript);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Mood header ──────────────────────────────────── */}
      <div className="flex items-center gap-2.5 mt-3 mb-3">
        <span className="text-2xl leading-none">{emoji}</span>
        <div>
          <p
            className="text-[13px] font-semibold capitalize leading-none"
            style={{ color: "var(--foreground)" }}
          >
            Feeling {mood || "something"}
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em] mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Logged at {formatTime(entry.createdAt)}
          </p>
        </div>

        {entry.alignment && (
          <span
            className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={alignmentStyle(entry.alignment)}
          >
            {entry.alignment}
          </span>
        )}
      </div>

      {/* ── Pull-quote + Themes ───────────────────────────── */}
      {pullQuote && (
        <div className="flex flex-col gap-2.5 px-0.5 mb-2">
          <h2
            className="text-[28px] leading-[1.35] italic"
            style={{ color: "var(--foreground)" }}
          >
            "{pullQuote}"
          </h2>

          {entry.themes.length > 0 && (
            <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap mt-1">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em] flex-shrink-0"
                style={{ color: "var(--muted-foreground)" }}
              >
                themes
              </span>
              <span
                className="text-[10px] font-light flex-shrink-0"
                style={{ color: "var(--color-neutral-400)" }}
              >
                —
              </span>
              {entry.themes.slice(0, 3).map((t, i) => (
                <span key={t} className="flex items-baseline gap-2">
                  <span
                    className="text-[12px] font-medium capitalize"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t}
                  </span>
                  {i < Math.min(entry.themes.length, 3) - 1 && (
                    <span
                      className="text-[11px] font-light leading-none"
                      style={{ color: "var(--color-neutral-400)" }}
                    >
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Audio player ─────────────────────────────────── */}
      <AudioPlayer src={entry.audioUrl} durationSeconds={entry.durationSeconds} />

      {/* ── CTA ──────────────────────────────────────────── */}
      <Link
        href={`/archive/${entry.id}`}
        className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-all my-4"
        style={{ border: "1px solid var(--color-primary)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-bold leading-snug">
            What's beneath the surface
          </span>
          <span className="text-[10px] font-semibold tracking-[0.06em]">
            patterns · insights · audio
          </span>
        </div>

        {/* Radial icon */}
        <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px] flex-shrink-0">
          <circle cx="11" cy="11" r="3" fill="var(--color-primary)" opacity="0.7" />
          {[
            ["11","1","11","5"], ["11","17","11","21"],
            ["1","11","5","11"], ["17","11","21","11"],
          ].map(([x1, y1, x2, y2]) => (
            <line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          ))}
          {[
            ["3.5","3.5","6.5","6.5"], ["15.5","15.5","18.5","18.5"],
            ["18.5","3.5","15.5","6.5"], ["6.5","15.5","3.5","18.5"],
          ].map(([x1, y1, x2, y2]) => (
            <line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
          ))}
        </svg>
      </Link>
    </div>
  );
}