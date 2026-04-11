"use client";

import { useState } from "react";

const NUDGES = [
  "What did you actually do this evening vs what you planned?",
  "Did the evening slip away before you noticed?",
  "What pulled you to your phone this evening?",
  "Was this evening's scroll worth what you traded for it?",
  "Did you talk to someone you live with this evening?",
  "What did you tell yourself you'd do but didn't?",
  "When did you last have a genuinely good evening?",
  "Did this evening feel restful or just passive?",
  "What would a 9pm version of you have wanted?",
  "Did anyone get your real attention this evening?",
  "How many hours of evening did you actually feel present?",
  "What habit quietly took over your evening again?",
  "Did you eat dinner or just snack and scroll?",
  "What were you avoiding by staying on your phone?",
  "Was there a moment this evening you felt actually alive?",
  "Did the evening end the way you wanted it to?",
  "What did you open your phone for and forget why?",
  "Who did you mean to call but didn't this evening?",
  "What would a walk this evening have changed?",
  "Did this evening belong to you or your screen?",
  "What's the last thing you did before it got late?",
  "What small evening ritual did you skip again?",
  "Did you feel the evening or just survive until bedtime?",
  "What would you have done with one extra focused hour?",
  "What does this evening say about your week overall?",
];

export default function NudgeCard({ seed }: { seed: number }) {
  const [index, setIndex] = useState(seed % NUDGES.length);

  const next = () => setIndex((prev) => (prev + 1) % NUDGES.length);

  return (
    <button
      onClick={next}
      className="w-full text-left rounded-2xl active:scale-[0.98] transition-transform"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        padding: "8px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg
            viewBox="0 0 24 24"
            style={{
              width: "14px",
              height: "14px",
              fill: "var(--muted-foreground)",
              flexShrink: 0,
            }}
          >
            <path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 14h-4v-1h4v1Zm0-2.28V13a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.72A5 5 0 1 1 17 9a4.93 4.93 0 0 1-3 4.72ZM10 19h4v1h-4Zm1 2h2v1h-2Z" />
          </svg>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--muted-foreground)",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Gentle nudge
          </p>
        </div>
        <p
          style={{
            fontSize: "10px",
            color: "var(--color-neutral-400, #C4BDB5)",
            margin: 0,
          }}
        >
          tap to change
        </p>
      </div>

      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.55,
          color: "var(--foreground)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          margin: 0,
          opacity: 0.85,
        }}
      >
        "{NUDGES[index]}"
      </p>
    </button>
  );
}