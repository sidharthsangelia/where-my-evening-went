import { auth } from "@clerk/nextjs/server";
import { getDayEntry } from "@/actions/entry";
import { parseDateParam, toDateParam } from "@/lib/week";
import Link from "next/link";
import AudioPlayer from "./AudioPlayer";
import NudgeCard from "./NudgeCard";

type Entry = NonNullable<Awaited<ReturnType<typeof getDayEntry>>>;

interface Props {
  date: string;
  isToday: boolean;
}

// ─── Root ──────────────────────────────────────────────────────────────────

export default async function DayContent({ date }: Props) {
  const { userId } = await auth();
  if (!userId) return null;

  const entry = await getDayEntry(userId, date);
  const isToday = date === toDateParam(new Date());
  const selectedDate = parseDateParam(date);
  const isFuture = selectedDate > new Date();

  if (isFuture) return <FutureDay />;
  if (!entry) return <NoEntry date={date} isToday={isToday} />;
  return <EntryPreview entry={entry} />;
}

// ─── No Entry ──────────────────────────────────────────────────────────────

function NoEntry({ date, isToday }: { date: string; isToday: boolean }) {
  const seed = parseInt(date.replace(/-/g, ""), 10);

  return (
    <div className="flex flex-col px-1" style={{ color: "var(--foreground)" }}>
      {/* ── Large serif heading ─────────────────────────── */}
      <div className="mt-2 mb-6">
        <h1
          className="text-[34px] font-bold leading-[1.15]"
          style={{
            color: "var(--foreground)",
          }}
        >
          {isToday
            ? "How did your\nevening unfold?"
            : "How did that\nevening unfold?"}
        </h1>
      </div>

      {/* ── Big mic button ──────────────────────────────── */}
      <div className="flex flex-col items-center pt-8 pb-8">
        <div className="relative flex items-center justify-center">
          {/* Ripple rings */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 140,
              height: 140,
              border: "1.5px solid var(--color-primary-light, #8b2400)",
              opacity: 0.25,
              animation: "ripple 2.5s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 120,
              height: 120,
              border: "1px solid var(--color-primary-light, #8b2400)",
              opacity: 0.2,
              animation: "ripple 2.5s ease-out 0.8s infinite",
            }}
          />
          {/* Main button */}
          <Link
            href="/record"
            className="w-24 h-24 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg"
            style={{ background: "var(--primary)" }}
          >
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4Z" />
              <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.08A7 7 0 0 0 19 10Z" />
            </svg>
          </Link>
        </div>
      </div>

      <NudgeCard seed={seed} />
    </div>
  );
}

// ─── Future Day ────────────────────────────────────────────────────────────

function FutureDay() {
  return (
    <div
      className="rounded-2xl border-2 border-dashed p-5 flex items-center gap-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--muted)" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ fill: "var(--muted-foreground)" }}
        >
          <path d="M17 12h-5v5h5v-5ZM16 1v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1h-2Zm3 18H5V8h14v11Z" />
        </svg>
      </div>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Nothing here yet — check back later.
      </p>
    </div>
  );
}

// ─── Entry Preview ─────────────────────────────────────────────────────────

function EntryPreview({ entry }: { entry: Entry }) {
  if (entry.status === "PROCESSING" || entry.status === "UPLOADED") {
    return <ProcessingCard />;
  }
  if (entry.status === "FAILED") {
    return <FailedCard />;
  }

  const mood = entry.userMood ?? entry.vibe ?? "";
  const emoji = moodEmoji(mood);
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
      <AudioPlayer
        src={entry.audioUrl}
        durationSeconds={entry.durationSeconds}
      />

      {/* ── Key pattern ──────────────────────────────────── */}
      {/* {entry.pattern && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <p
              className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              Key Pattern
            </p>
            <p
              className="text-[13px] font-semibold leading-snug capitalize"
              style={{ color: "var(--foreground)" }}
            >
              {entry.pattern}
            </p>
          </div>
        </div>
      )} */}

      {/* ── CTA ──────────────────────────────────────────── */}
      <Link
        href={`/archive/${entry.id}`}
        className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-all my-4 "
        style={{ border: "1px solid var(--color-primary)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-bold leading-snug  ">
            What's beneath the surface
          </span>
          <span
            className="text-[10px] font-semibold tracking-[0.06em]"
            // style={{ color: "rgba(255,255,255,0.5)" }}
          >
            patterns · insights · audio
          </span>
        </div>

        <svg
          viewBox="0 0 22 22"
          fill="none"
          className="w-[22px] h-[22px] flex-shrink-0"
        >
          <circle
            cx="11"
            cy="11"
            r="3"
            fill="var(--color-primary)"
            opacity="0.7"
          />
          <line
            x1="11"
            y1="1"
            x2="11"
            y2="5"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="11"
            y1="17"
            x2="11"
            y2="21"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="1"
            y1="11"
            x2="5"
            y2="11"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="17"
            y1="11"
            x2="21"
            y2="11"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="3.5"
            y1="3.5"
            x2="6.5"
            y2="6.5"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />
          <line
            x1="15.5"
            y1="15.5"
            x2="18.5"
            y2="18.5"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />
          <line
            x1="18.5"
            y1="3.5"
            x2="15.5"
            y2="6.5"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />
          <line
            x1="6.5"
            y1="15.5"
            x2="3.5"
            y2="18.5"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />
        </svg>
      </Link>
    </div>
  );
}
// ─── Status cards ──────────────────────────────────────────────────────────

function ProcessingCard() {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 animate-pulse"
        style={{ background: "var(--color-secondary-light, #f3d98e)" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ fill: "var(--color-secondary-dark, #c49a2a)" }}
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 13H4a1 1 0 0 1 0-2h.07A8 8 0 0 1 11 4.07V4a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 11H20a1 1 0 0 1 0 2h-.07A8 8 0 0 1 13 16.93Z" />
        </svg>
      </div>
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Processing your entry
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--muted-foreground)" }}
        >
          Usually takes under a minute
        </p>
      </div>
    </div>
  );
}

function FailedCard() {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: "var(--card)",
        border:
          "1px solid color-mix(in srgb, var(--destructive) 30%, transparent)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: "color-mix(in srgb, var(--destructive) 10%, transparent)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ fill: "var(--destructive)" }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
        </svg>
      </div>
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Something went wrong
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--muted-foreground)" }}
        >
          Recording saved — we'll retry processing
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function extractPullQuote(transcript: string | null): string | null {
  if (!transcript) return null;
  const sentences = transcript.split(/(?<=[.!?])\s+/);
  const short = sentences.find((s) => s.length >= 20 && s.length <= 120);
  return short?.replace(/^["']|["']$/g, "") ?? null;
}

function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy: "😊",
    sad: "😔",
    anxious: "😰",
    calm: "😌",
    excited: "🤩",
    tired: "😴",
    angry: "😤",
    grateful: "🙏",
    overwhelmed: "😵",
    neutral: "😐",
  };
  return map[mood.toLowerCase()] ?? "🌙";
}

function alignmentStyle(alignment: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    aligned: { background: "#dcfce7", color: "#166534" },
    mixed: { background: "#fef9c3", color: "#854d0e" },
    contrasting: { background: "#fee2e2", color: "#991b1b" },
  };
  return (
    map[alignment.toLowerCase()] ?? {
      background: "var(--muted)",
      color: "var(--muted-foreground)",
    }
  );
}
