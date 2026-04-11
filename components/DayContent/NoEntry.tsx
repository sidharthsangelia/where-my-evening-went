import Link from "next/link";
import NudgeCard from "../NudgeCard";

interface Props {
  date: string;
  isToday: boolean;
}

export default function NoEntry({ date, isToday }: Props) {
  const seed = parseInt(date.replace(/-/g, ""), 10);

  return (
    <div className="flex flex-col px-1" style={{ color: "var(--foreground)" }}>
      {/* ── Heading ─────────────────────────────────────── */}
      <div className="mt-2 mb-6">
        <h1
          className="text-[34px] font-bold leading-[1.15]"
          style={{ color: "var(--foreground)" }}
        >
          {isToday
            ? "How did your\nevening unfold?"
            : "How did that\nevening unfold?"}
        </h1>
      </div>

      {/* ── Mic button ──────────────────────────────────── */}
      <div className="flex flex-col items-center pt-8 pb-8">
        <div className="relative flex items-center justify-center">
          {/* Ripple rings */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 140, height: 140,
              border: "1.5px solid var(--color-primary-light, #8b2400)",
              opacity: 0.25,
              animation: "ripple 2.5s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 120, height: 120,
              border: "1px solid var(--color-primary-light, #8b2400)",
              opacity: 0.2,
              animation: "ripple 2.5s ease-out 0.8s infinite",
            }}
          />
          {/* Button */}
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