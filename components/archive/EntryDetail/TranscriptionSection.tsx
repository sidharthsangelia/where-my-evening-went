"use client";

import { useState } from "react";

interface Props {
  transcript: string | null;
  pullQuote: string | null;
}

export default function TranscriptSection({ transcript, pullQuote }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!transcript) return null;

  return (
    <div className="px-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[9px] font-black uppercase tracking-[0.25em]"
          style={{ color: "var(--color-neutral-500)" }}
        >
          ◈ transcript
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--color-neutral-200)" }}
        />
      </div>

      {/* Pull quote — always visible */}
      {pullQuote && (
        <blockquote
          className="text-[24px] leading-[1.4] mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-neutral-800)",
            fontStyle: "italic",
          }}
        >
          "{pullQuote}"
        </blockquote>
      )}

      {/* Full transcript — expandable */}
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: expanded ? "999px" : "0px" }}
      >
        <p
          className="text-[14px] leading-[1.8] pt-2 pb-4"
          style={{ color: "var(--color-neutral-700)" }}
        >
          {transcript}
        </p>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 mt-1 group"
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "var(--color-primary)" }}
        >
          {expanded ? "Collapse" : "Read full transcript"}
        </span>
        <span
          className="text-[11px] transition-transform duration-300"
          style={{
            color: "var(--color-primary)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ↓
        </span>
      </button>
    </div>
  );
}