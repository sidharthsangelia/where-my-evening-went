import Link from "next/link";
import {
  moodEmoji, formatDateShort, formatDuration,
  getAlignment, alignmentConfig,
} from "./helpers";

type Entry = {
  id: string;
  userMood: string | null;
  vibe: string | null;
  alignment: string | null;
  durationSeconds: number | null;
  themes: string[];
  createdAt: Date;
};

export default function EntryListItem({ entry }: { entry: Entry }) {
  const mood     = entry.userMood ?? entry.vibe ?? "";
  const emoji    = moodEmoji(mood);
  const alignKey = getAlignment(entry.alignment);
  const alignCfg = alignKey ? alignmentConfig[alignKey] : null;
  const duration = formatDuration(entry.durationSeconds);

  return (
    <Link href={`/archive/${entry.id}`}>
      <div
        className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
        style={{
          background: "var(--card)",
          border: "1px solid var(--color-neutral-200)",
        }}
      >
        {/* Emoji dot */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-lg"
          style={{ background: "var(--color-neutral-100)" }}
        >
          {emoji}
        </div>

        {/* Middle — mood + date */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span
            className="text-[14px] font-semibold capitalize leading-none truncate"
            style={{ color: "var(--color-neutral-900)" }}
          >
            {mood || "Evening entry"}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--color-neutral-400)" }}
          >
            {formatDateShort(entry.createdAt)}
            {duration && ` · ${duration}`}
          </span>
        </div>

        {/* Right — alignment dot + arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {alignCfg && (
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: alignCfg.dot }}
              title={alignCfg.label}
            />
          )}
          <span style={{ color: "var(--color-neutral-400)", fontSize: 16 }}>→</span>
        </div>
      </div>
    </Link>
  );
}