import Link from "next/link";
import FeaturedCard from "./FeaturedCard";
import EntryListItem from "./EntryListItem";

type Entry = {
  id: string;
  userMood: string | null;
  vibe: string | null;
  alignment: string | null;
  durationSeconds: number | null;
  transcript: string | null;
  themes: string[];
  insight: string | null;
  pattern: string | null;
  status: string;
  createdAt: Date;
};

interface Props {
  entries: Entry[];
}

export default function ArchivePage({ entries }: Props) {
  const featured = entries.slice(0, 3);
  const rest     = entries.slice(3);

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: "var(--color-neutral)" }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div className="px-5 pt-10 pb-6">
        <p
          className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
          style={{ color: "var(--color-neutral-500)" }}
        >
          ◈ your archive
        </p>
        <h1
          className="text-[32px] font-bold leading-tight tracking-tight"
          style={{
            color: "var(--color-neutral-900)",
            fontFamily: "var(--font-display)",
          }}
        >
          Every evening,<br />
          <em style={{ color: "var(--color-primary)", fontStyle: "italic" }}>
            captured.
          </em>
        </h1>

        {entries.length > 0 && (
          <p
            className="text-[12px] mt-2"
            style={{ color: "var(--color-neutral-500)" }}
          >
            {entries.length} {entries.length === 1 ? "entry" : "entries"} logged
          </p>
        )}
      </div>

      {/* ── Empty state ─────────────────────────────── */}
      {entries.length === 0 && (
        <div className="px-5 mt-8 flex flex-col items-center text-center gap-4">
          <span className="text-5xl">🌙</span>
          <p
            className="text-[16px] font-semibold"
            style={{ color: "var(--color-neutral-700)" }}
          >
            Nothing here yet.
          </p>
          <p
            className="text-[13px]"
            style={{ color: "var(--color-neutral-500)" }}
          >
            Your recorded evenings will show up here.
          </p>
          <Link
            href="/record"
            className="mt-2 px-5 py-2.5 rounded-full text-[13px] font-bold"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            Record your first entry
          </Link>
        </div>
      )}

      {/* ── Featured cards (first 3) ─────────────────── */}
      {featured.length > 0 && (
        <div className="px-5 flex flex-col gap-4 mb-8">
          {featured.map((entry, i) => (
            <FeaturedCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}

      {/* ── List (rest) ──────────────────────────────── */}
      {rest.length > 0 && (
        <div className="px-5">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ color: "var(--color-neutral-500)" }}
            >
              ◈ older entries
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-neutral-200)" }}
            />
          </div>

          <div className="flex flex-col gap-2.5 mb-8">
            {rest.map((entry) => (
              <EntryListItem key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}