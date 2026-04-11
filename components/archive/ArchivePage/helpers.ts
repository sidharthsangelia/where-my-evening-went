export function moodEmoji(mood: string | null | undefined): string {
  if (!mood) return "🌙";
  const map: Record<string, string> = {
    happy: "😊", sad: "😔", anxious: "😰", calm: "😌",
    excited: "🤩", tired: "😴", angry: "😤", grateful: "🙏",
    overwhelmed: "😵", neutral: "😐",
  };
  return map[mood.toLowerCase()] ?? "🌙";
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function formatDateFull(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

export function formatDuration(seconds: number | null | undefined): string | null {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function extractPullQuote(transcript: string | null | undefined): string | null {
  if (!transcript) return null;
  const sentences = transcript.split(/(?<=[.!?])\s+/);
  return (
    sentences
      .find((s) => s.length >= 30 && s.length <= 130)
      ?.replace(/^["']|["']$/g, "") ?? null
  );
}

export type AlignmentKey = "aligned" | "mixed" | "contrasting";

type AlignmentValue = { dot: string; bg: string; text: string; label: string };

export const alignmentConfig: { [K in AlignmentKey]: AlignmentValue } = {
  aligned:     { dot: "#16a34a", bg: "#f0fdf4", text: "#166534", label: "In Sync"     },
  mixed:       { dot: "#d97706", bg: "#fffbeb", text: "#92400e", label: "Mixed"        },
  contrasting: { dot: "#e11d48", bg: "#fff1f2", text: "#9f1239", label: "At Odds"      },
};

export function getAlignment(a: string | null | undefined): AlignmentKey | null {
  if (!a) return null;
  const k = a.toLowerCase() as AlignmentKey;
  return k in alignmentConfig ? k : null;
}

const ROTATIONS = [-2, 1.5, -1, 2.5, -1.5, 1];
export function themeRotation(i: number) {
  return ROTATIONS[i % ROTATIONS.length];
}