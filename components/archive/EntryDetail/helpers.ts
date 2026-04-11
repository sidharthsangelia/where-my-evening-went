export function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy: "😊", sad: "😔", anxious: "😰", calm: "😌",
    excited: "🤩", tired: "😴", angry: "😤", grateful: "🙏",
    overwhelmed: "😵", neutral: "😐",
  };
  return map[mood?.toLowerCase()] ?? "🌙";
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export function extractPullQuote(transcript: string | null): string | null {
  if (!transcript) return null;
  const sentences = transcript.split(/(?<=[.!?])\s+/);
  return sentences.find((s) => s.length >= 30 && s.length <= 140)
    ?.replace(/^["']|["']$/g, "") ?? null;
}

export type AlignmentKey = "aligned" | "mixed" | "contrasting";

type AlignmentValue = {
  label: string;
  bg: string;
  text: string;
  accent: string;
  dot: string;
};

export const alignmentConfig: { [K in AlignmentKey]: AlignmentValue } = {
  aligned: {
    label: "Aligned",
    bg:     "#f0fdf4",
    text:   "#166534",
    accent: "#22c55e",
    dot:    "#16a34a",
  },
  mixed: {
    label: "Somewhere in between",
    bg:     "#fffbeb",
    text:   "#92400e",
    accent: "#f59e0b",
    dot:    "#d97706",
  },
  contrasting: {
    label: "Contrasting",
    bg:     "#fff1f2",
    text:   "#9f1239",
    accent: "#f43f5e",
    dot:    "#e11d48",
  },
};

export function getAlignment(a: string | null): AlignmentKey | null {
  if (!a) return null;
  const k = a.toLowerCase() as AlignmentKey;
  return k in alignmentConfig ? k : null;
}