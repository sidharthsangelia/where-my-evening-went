import Image from "next/image";
 
import AiOptInToggle from "./AiOptInToggle";
import PrivacySection from "./PrivacySection";
import DangerZone from "./DangerZone";

interface User {
  name:      string;
  email:     string;
  timezone:  string;
  aiOptIn:   boolean;
  aiOptInAt: Date | null;
  createdAt: Date;
  avatarUrl: string | null;
}

interface Stats {
  entryCount:   number;
  totalSeconds: number;
  topMood:      string | null;
  streak:       number;
}

interface Props {
  user:  User;
  stats: Stats;
}

export default function ProfilePage({ user, stats }: Props) {
  const memberSince = user.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  });

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--color-neutral)" }}>

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="px-5 pt-10 pb-8">
        <p
          className="text-[10px] font-black uppercase tracking-[0.25em] mb-6"
          style={{ color: "var(--color-neutral-500)" }}
        >
          ◈ profile
        </p>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full overflow-hidden shrink-0"
            style={{ boxShadow: "0 0 0 2px var(--color-primary)" }}
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xl font-black"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1
              className="text-[22px] font-bold leading-tight truncate"
              style={{
                color:      "var(--color-neutral-900)",
                fontFamily: "var(--font-display)",
              }}
            >
              {user.name}
            </h1>
            <p
              className="text-[12px] truncate"
              style={{ color: "var(--color-neutral-500)" }}
            >
              {user.email}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--color-neutral-400)" }}
            >
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Timezone pill */}
        <div
          className="inline-flex items-center gap-1.5 mt-5 px-3 py-1.5 rounded-full"
          style={{ background: "var(--color-neutral-200)" }}
        >
          <span className="text-sm">🌍</span>
          <span
            className="text-[11px] font-bold"
            style={{ color: "var(--color-neutral-600)" }}
          >
            {user.timezone}
          </span>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────── */}
      <div className="mx-5 mb-8 h-px" style={{ background: "var(--color-neutral-200)" }} />

      {/* ── Stats ───────────────────────────────────── */}
      {/* <StatsGrid {...stats} /> */}

      {/* ── AI toggle ───────────────────────────────── */}
      <AiOptInToggle enabled={user.aiOptIn} enabledAt={user.aiOptInAt} />

      {/* ── Privacy & legal ─────────────────────────── */}
      <PrivacySection />

      {/* ── Account / danger zone ───────────────────── */}
      <DangerZone />

      {/* ── App version footer ──────────────────────── */}
      <div className="px-5 pt-2 flex flex-col gap-1">
        <p className="text-[10px]" style={{ color: "var(--color-neutral-400)" }}>
          Version 1.0.0
        </p>
        <p className="text-[10px]" style={{ color: "var(--color-neutral-400)" }}>
          Made with 🌙 for the overthinkers.
        </p>
      </div>
    </div>
  );
}