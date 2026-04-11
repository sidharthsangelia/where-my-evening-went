"use client";

import { toggleAiOptIn } from "@/actions/profile";
import { useTransition } from "react";
 

interface Props {
  enabled:   boolean;
  enabledAt: Date | null;
}

export default function AiOptInToggle({ enabled, enabledAt }: Props) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => toggleAiOptIn(enabled));
  }

  return (
    <div className="px-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[9px] font-black uppercase tracking-[0.25em]"
          style={{ color: "var(--color-neutral-500)" }}
        >
          ◈ ai oracle
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--color-neutral-200)" }} />
      </div>

      <div
        className="rounded-[20px] p-5"
        style={{
          background: "var(--card)",
          border: "1px solid var(--color-neutral-200)",
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-col gap-1">
            <span
              className="text-[15px] font-bold leading-snug"
              style={{ color: "var(--color-neutral-900)" }}
            >
              AI-powered insights
            </span>
            <span
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--color-neutral-600)" }}
            >
              Let the oracle analyse your entries — mood detection, patterns,
              pull quotes, and deeper reflections.
            </span>
          </div>

          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={pending}
            aria-label={enabled ? "Disable AI insights" : "Enable AI insights"}
            className="shrink-0 relative w-12 h-6 rounded-full transition-colors duration-300"
            style={{
              background:  enabled ? "var(--color-primary)" : "var(--color-neutral-300)",
              opacity:     pending ? 0.6 : 1,
            }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
              style={{ left: enabled ? "calc(100% - 1.35rem)" : "0.125rem" }}
            />
          </button>
        </div>

        {/* Sub-note */}
        <p
          className="text-[10px] leading-relaxed"
          style={{ color: "var(--color-neutral-400)" }}
        >
          {enabled
            ? `Enabled${enabledAt ? ` · since ${enabledAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}` : ""}. Your audio is transcribed and processed by AI. Raw audio is never stored beyond your session.`
            : "Disabled. Your entries are stored as raw audio only. No transcription or AI processing occurs."}
        </p>
      </div>
    </div>
  );
}