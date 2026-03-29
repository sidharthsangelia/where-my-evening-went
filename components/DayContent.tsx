import { auth } from "@clerk/nextjs/server";
import { getDayEntry } from "@/actions/entry";
import { parseDateParam, toDateParam } from "@/lib/week";
import Link from "next/link";

type Entry = NonNullable<Awaited<ReturnType<typeof getDayEntry>>>;

interface Props {
  date: string;
}

// ─── Prompts pool — deterministically rotated by date ──────────────────────

const PROMPTS = [
  { text: "What surprised you tonight?", icon: "✨" },
  { text: "What's still on your mind?", icon: "💭" },
  { text: "What made you laugh today?", icon: "😄" },
  { text: "What drained your energy?", icon: "🔋" },
  { text: "Who did you connect with?", icon: "👥" },
  { text: "What do you want to remember?", icon: "📌" },
  { text: "What are you grateful for?", icon: "🙏" },
  { text: "How did your body feel today?", icon: "🫀" },
  { text: "What would you do differently?", icon: "🔄" },
];

const MOODS = [
  { key: "happy",   emoji: "😊", label: "Good"    },
  { key: "calm",    emoji: "😌", label: "Calm"    },
  { key: "tired",   emoji: "😴", label: "Tired"   },
  { key: "anxious", emoji: "😰", label: "Anxious" },
  { key: "sad",     emoji: "😔", label: "Meh"     },
  { key: "excited", emoji: "🤩", label: "Pumped"  },
];

// ─── Root ──────────────────────────────────────────────────────────────────

export default async function DayContent({ date }: Props) {
  const { userId } = await auth();
  if (!userId) return null;

  const entry = await getDayEntry(userId, date);
  const isToday = date === toDateParam(new Date());
  const selectedDate = parseDateParam(date);
  const isFuture = selectedDate > new Date();

  if (isFuture) return <FutureDay />;
  if (!entry)   return <NoEntry date={date} isToday={isToday} />;
  return <EntryPreview entry={entry} />;
}

// ─── No Entry ──────────────────────────────────────────────────────────────

function NoEntry({ date, isToday }: { date: string; isToday: boolean }) {
  // Deterministic prompt selection based on date
  const seed = parseInt(date.replace(/-/g, ""), 10);
  const prompts = [
    PROMPTS[seed % PROMPTS.length],
    PROMPTS[(seed + 3) % PROMPTS.length],
    PROMPTS[(seed + 6) % PROMPTS.length],
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Night-sky hero card ─────────────────────────── */}
      <div
        className="rounded-3xl p-5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #1c1410 0%, #2a1c0d 45%, #150f08 100%)",
          minHeight: "210px",
        }}
      >
        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: "10%", left: "16%", w: 3, o: 0.4 },
            { top: "6%",  left: "52%", w: 2, o: 0.25 },
            { top: "22%", left: "77%", w: 3, o: 0.3 },
            { top: "32%", left: "38%", w: 2, o: 0.2 },
            { top: "4%",  left: "30%", w: 3, o: 0.35 },
            { top: "18%", left: "87%", w: 2, o: 0.25 },
            { top: "42%", left: "10%", w: 2, o: 0.2 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: s.w,
                height: s.w,
                opacity: s.o,
              }}
            />
          ))}

          {/* Moon */}
          <div
            className="absolute rounded-full"
            style={{
              width: 72,
              height: 72,
              top: -16,
              right: 20,
              background: "#fefce8",
              boxShadow:
                "0 0 40px 8px rgba(254,249,236,0.12), 0 0 70px 20px rgba(245,178,27,0.06)",
            }}
          />
        </div>

        {/* Text content */}
        <div className="relative z-10">
          <p className="text-[9px] font-bold text-white/35 uppercase tracking-[0.16em] mb-3">
            {isToday ? "This evening" : "That evening"}
          </p>

          <h2 className="text-white font-bold text-xl leading-snug mb-1.5">
            {isToday
              ? "Where did your\nevening go?"
              : "You didn't log\nthis evening"}
          </h2>

          <p className="text-white/45 text-[13px] leading-relaxed mb-6">
            {isToday
              ? "Talk for 3 minutes. We'll handle the rest."
              : "It's not too late — add a late entry."}
          </p>

          {/* Record button with animated waveform bars */}
          <Link
            href={`/record?date=${date}`}
            className="flex items-center justify-center gap-3 w-full py-[15px] rounded-2xl font-bold text-[15px] active:scale-[0.97] transition-transform"
            style={{ background: "#f5b21b", color: "#fff" }}
          >
            <span className="text-base">🎙️</span>

            {/* Waveform — uses the waveBar keyframe from globals.css */}
            <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
              {[4, 9, 6, 13, 8, 11, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full bg-white/75"
                  style={{
                    height: h,
                    animation: `waveBar 1.2s ease-in-out ${i * 0.12}s infinite`,
                  }}
                />
              ))}
            </div>

            Start recording
          </Link>
        </div>
      </div>

      {/* ── Mood picker ─────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#9a9185] uppercase tracking-widest mb-3 px-0.5">
          How are you feeling?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MOODS.map((mood) => (
            <Link
              key={mood.key}
              href={`/record?date=${date}&mood=${mood.key}`}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white border border-[#e8e4da] hover:border-[#f5b21b]/50 hover:bg-[#fefce8] active:scale-95 transition-all"
            >
              <span className="text-[22px] leading-none">{mood.emoji}</span>
              <span className="text-[11px] font-semibold text-[#7a7168]">
                {mood.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Reflection prompts ───────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#9a9185] uppercase tracking-widest mb-3 px-0.5">
          Need a starting point?
        </p>
        <div className="flex flex-col gap-2">
          {prompts.map((prompt) => (
            <Link
              key={prompt.text}
              href={`/record?date=${date}&prompt=${encodeURIComponent(prompt.text)}`}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#e8e4da] hover:border-[#f5b21b]/40 hover:bg-[#fefce8] active:scale-[0.98] transition-all group"
            >
              <span className="text-base shrink-0">{prompt.icon}</span>
              <p className="text-[13px] text-[#4a463f] leading-snug">{prompt.text}</p>
              <span className="text-[#d0ccc4] ml-auto shrink-0 group-hover:text-[#f5b21b] transition-colors text-sm">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Future Day ────────────────────────────────────────────────────────────

function FutureDay() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#e0ddd5] p-5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#f4f1e8] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#b0a89e]">
          <path d="M17 12h-5v5h5v-5ZM16 1v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1h-2Zm3 18H5V8h14v11Z" />
        </svg>
      </div>
      <p className="text-sm text-[#b0a89e]">
        Nothing here yet — check back later.
      </p>
    </div>
  );
}

// ─── Entry Preview (completed entry) ──────────────────────────────────────

function EntryPreview({ entry }: { entry: Entry }) {
  if (entry.status === "PROCESSING" || entry.status === "UPLOADED") {
    return <ProcessingCard />;
  }
  if (entry.status === "FAILED") {
    return <FailedCard />;
  }

  const emoji = moodEmoji(entry.mood ?? "");
  const mc = moodColors(entry.mood ?? "");

  return (
    <div className="flex flex-col gap-3">
      {/* Main entry card */}
      <div
        className="rounded-3xl overflow-hidden border border-[#e8e4da]"
        style={{ background: mc.cardBg }}
      >
        {/* Mood banner */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">{emoji}</span>
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-widest mb-0.5"
                style={{ color: mc.muted }}
              >
                Mood
              </p>
              <p
                className="text-sm font-bold capitalize"
                style={{ color: mc.text }}
              >
                {entry.mood ?? "Not recorded"}
              </p>
            </div>
          </div>

          {entry.durationSeconds && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: mc.pill }}
            >
              {/* Mini waveform pip */}
              <div className="flex items-end gap-[2px]">
                {[3, 5, 4, 7, 4, 6, 3].map((h, i) => (
                  <div
                    key={i}
                    className="w-[2px] rounded-full"
                    style={{ height: h, background: mc.text, opacity: 0.55 }}
                  />
                ))}
              </div>
              <span
                className="text-[11px] font-semibold tabular-nums"
                style={{ color: mc.text }}
              >
                {formatDuration(entry.durationSeconds)}
              </span>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="px-4 pb-4">
          {entry.summary ? (
            <p className="text-[13px] text-[#6b6560] leading-relaxed line-clamp-3">
              {entry.summary}
            </p>
          ) : entry.transcript ? (
            <p className="text-[13px] text-[#6b6560] leading-relaxed line-clamp-3 italic">
              {entry.transcript}
            </p>
          ) : null}
        </div>
      </div>

      {/* Emotion chips */}
      {entry.emotions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-[#9a9185] uppercase tracking-widest mb-2 px-0.5">
            Emotions
          </p>
          <div className="flex flex-wrap gap-2">
            {entry.emotions.slice(0, 5).map((e) => (
              <span
                key={e}
                className="text-[11px] bg-[#fef3d0] text-[#a07a10] px-3 py-1.5 rounded-full font-semibold"
              >
                {e}
              </span>
            ))}
            {entry.emotions.length > 5 && (
              <span className="text-[11px] text-[#b0a89e] py-1.5 px-1">
                +{entry.emotions.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              className="text-[11px] bg-[#f4f1e8] text-[#7a7168] px-3 py-1.5 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* View full */}
      <Link
        href={`/archive/${entry.id}`}
        className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-[#f4f1e8] text-[#7a7168] text-[13px] font-semibold hover:bg-[#eae7dc] active:scale-[0.98] transition-all"
      >
        View full entry <span className="text-[#b0a89e]">→</span>
      </Link>
    </div>
  );
}

// ─── Status cards ──────────────────────────────────────────────────────────

function ProcessingCard() {
  return (
    <div className="rounded-2xl bg-white border border-[#e8e4da] p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#fef3d0] flex items-center justify-center shrink-0 animate-pulse">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#f5b21b]">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 13H4a1 1 0 0 1 0-2h.07A8 8 0 0 1 11 4.07V4a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 11H20a1 1 0 0 1 0 2h-.07A8 8 0 0 1 13 16.93Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#4a463f]">
          Processing your entry
        </p>
        <p className="text-xs text-[#b0a89e] mt-0.5">
          Usually takes under a minute
        </p>
      </div>
    </div>
  );
}

function FailedCard() {
  return (
    <div className="rounded-2xl bg-white border border-red-100 p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#4a463f]">
          Something went wrong
        </p>
        <p className="text-xs text-[#b0a89e] mt-0.5">
          Recording saved — we'll retry processing
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy: "😊", sad: "😔", anxious: "😰", calm: "😌",
    excited: "🤩", tired: "😴", angry: "😤", grateful: "🙏",
    overwhelmed: "😵", neutral: "😐",
  };
  return map[mood.toLowerCase()] ?? "🌙";
}

type MoodColors = {
  cardBg: string;
  text: string;
  muted: string;
  pill: string;
};

function moodColors(mood: string): MoodColors {
  const map: Record<string, MoodColors> = {
    happy:       { cardBg: "#fefce8", text: "#92400e", muted: "#b45309", pill: "#fef3c7" },
    excited:     { cardBg: "#fefce8", text: "#92400e", muted: "#b45309", pill: "#fef3c7" },
    grateful:    { cardBg: "#f0fdf4", text: "#166534", muted: "#15803d", pill: "#dcfce7" },
    calm:        { cardBg: "#f0fdf4", text: "#166534", muted: "#15803d", pill: "#dcfce7" },
    neutral:     { cardBg: "#f8fafc", text: "#475569", muted: "#64748b", pill: "#f1f5f9" },
    sad:         { cardBg: "#eff6ff", text: "#1e40af", muted: "#2563eb", pill: "#dbeafe" },
    anxious:     { cardBg: "#fff7ed", text: "#9a3412", muted: "#c2410c", pill: "#fed7aa" },
    overwhelmed: { cardBg: "#fff7ed", text: "#9a3412", muted: "#c2410c", pill: "#fed7aa" },
    angry:       { cardBg: "#fef2f2", text: "#991b1b", muted: "#b91c1c", pill: "#fee2e2" },
    tired:       { cardBg: "#faf5ff", text: "#6b21a8", muted: "#7e22ce", pill: "#f3e8ff" },
  };
  return (
    map[mood?.toLowerCase()] ?? {
      cardBg: "#f4f1e8",
      text: "#4a463f",
      muted: "#9a9185",
      pill: "#e8e4da",
    }
  );
}