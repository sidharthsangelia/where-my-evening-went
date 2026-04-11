export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function extractPullQuote(transcript: string | null): string | null {
  if (!transcript) return null;
  const sentences = transcript.split(/(?<=[.!?])\s+/);
  const short = sentences.find((s) => s.length >= 20 && s.length <= 120);
  return short?.replace(/^["']|["']$/g, "") ?? null;
}

export function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy:       "😊",
    sad:         "😔",
    anxious:     "😰",
    calm:        "😌",
    excited:     "🤩",
    tired:       "😴",
    angry:       "😤",
    grateful:    "🙏",
    overwhelmed: "😵",
    neutral:     "😐",
  };
  return map[mood.toLowerCase()] ?? "🌙";
}

export function alignmentStyle(alignment: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    aligned:     { background: "#dcfce7", color: "#166534" },
    mixed:       { background: "#fef9c3", color: "#854d0e" },
    contrasting: { background: "#fee2e2", color: "#991b1b" },
  };
  return (
    map[alignment.toLowerCase()] ?? {
      background: "var(--muted)",
      color: "var(--muted-foreground)",
    }
  );
}