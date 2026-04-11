"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useState } from "react";

export default function DangerZone() {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="px-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[9px] font-black uppercase tracking-[0.25em]"
          style={{ color: "var(--color-neutral-500)" }}
        >
          ◈ account
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--color-neutral-200)" }} />
      </div>

      <div className="flex flex-col gap-3">
        {/* Sign out */}
        <SignOutButton>
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
            style={{
              background: "var(--card)",
              border: "1px solid var(--color-neutral-200)",
            }}
          >
            <span
              className="text-[13px] font-semibold"
              style={{ color: "var(--color-neutral-800)" }}
            >
              Sign out
            </span>
            <span style={{ color: "var(--color-neutral-400)", fontSize: 16 }}>→</span>
          </button>
        </SignOutButton>

        {/* Export data */}
        <button
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
          style={{
            background: "var(--card)",
            border: "1px solid var(--color-neutral-200)",
          }}
        >
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-neutral-800)" }}
          >
            Export my data
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-neutral-400)" }}
          >
            coming soon
          </span>
        </button>

        {/* Delete account */}
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
            style={{
              background: "#fff1f2",
              border: "1px solid #fecdd3",
            }}
          >
            <span className="text-[13px] font-semibold" style={{ color: "#9f1239" }}>
              Delete account
            </span>
            <span style={{ color: "#fca5a5", fontSize: 16 }}>→</span>
          </button>
        ) : (
          <div
            className="px-4 py-4 rounded-2xl flex flex-col gap-3"
            style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}
          >
            <p className="text-[12px] leading-relaxed" style={{ color: "#9f1239" }}>
              This permanently deletes your account and all entries. There is no
              undo. Email us at{" "}
              <a href="mailto:delete@yourapp.com" className="underline font-semibold">
                delete@yourapp.com
              </a>{" "}
              to begin the process.
            </p>
            <button
              onClick={() => setShowDelete(false)}
              className="text-[11px] font-bold uppercase tracking-widest self-start"
              style={{ color: "#9f1239" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}