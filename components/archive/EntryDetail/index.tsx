import Link from "next/link";
import type { Entry } from "@/app/generated/prisma";
import AudioPlayer from "@/components/AudioPlayer";
import MoodHero from "./MoodHero";
import InsightOracle from "./InsightOracle";
import ThemesSection from "./ThemesSection";
import TranscriptSection from "./TranscriptionSection";
import { extractPullQuote } from "./helpers";

interface Props {
  entry: Entry;
}

export default function EntryDetail({ entry }: Props) {
  const pullQuote = extractPullQuote(entry.transcript);

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: "var(--color-neutral)" }}
    >
      {/* ── Sticky back nav ──────────────────────────── */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
        style={{
          background: "var(--color-neutral)",
          borderBottom: "1px solid var(--color-neutral-200)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 active:opacity-60 transition-opacity"
        >
          <span style={{ color: "var(--color-neutral-600)", fontSize: 18 }}>←</span>
          <span
            className="text-[12px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "var(--color-neutral-600)" }}
          >
            Back
          </span>
        </Link>

        {/* Status dot */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                entry.status === "COMPLETED" ? "#22c55e"
                : entry.status === "FAILED"  ? "#ef4444"
                : "#f59e0b",
            }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-neutral-500)" }}
          >
            {entry.status.toLowerCase()}
          </span>
        </div>
      </div>

      {/* ── Mood hero ───────────────────────────────── */}
      <MoodHero
        userMood={entry.userMood}
        vibe={entry.vibe}
        alignment={entry.alignment}
        createdAt={entry.createdAt}
      />

      {/* ── Divider ─────────────────────────────────── */}
      <div
        className="mx-5 mb-8 h-px"
        style={{ background: "var(--color-neutral-200)" }}
      />

      {/* ── Oracle insight ──────────────────────────── */}
      <InsightOracle insight={entry.insight} />

      {/* ── Themes + pattern ────────────────────────── */}
      <ThemesSection themes={entry.themes} pattern={entry.pattern} />

      {/* ── Audio ───────────────────────────────────── */}
      {entry.audioUrl && (
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ color: "var(--color-neutral-500)" }}
            >
              ◈ recording
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-neutral-200)" }}
            />
          </div>
          <AudioPlayer
            src={entry.audioUrl}
            durationSeconds={entry.durationSeconds}
          />
        </div>
      )}

      {/* ── Transcript ──────────────────────────────── */}
      <TranscriptSection
        transcript={entry.transcript}
        pullQuote={pullQuote}
      />

      {/* ── Metadata footer ─────────────────────────── */}
      <div
        className="mx-5 mt-4 mb-8 pt-6 flex flex-col gap-1.5"
        style={{ borderTop: "1px solid var(--color-neutral-200)" }}
      >
        {[
          entry.durationSeconds && `${Math.floor(entry.durationSeconds / 60)}m ${entry.durationSeconds % 60}s recording`,
          entry.processedAt && `Processed ${new Date(entry.processedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`,
          entry.tokensUsed && `${entry.tokensUsed.toLocaleString()} tokens used`,
        ]
          .filter(Boolean)
          .map((line) => (
            <p
              key={String(line)}
              className="text-[10px]"
              style={{ color: "var(--color-neutral-400)" }}
            >
              {line}
            </p>
          ))}
      </div>
    </div>
  );
}