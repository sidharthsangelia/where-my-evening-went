export function ProcessingCard() {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 animate-pulse"
        style={{ background: "var(--color-secondary-light, #f3d98e)" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ fill: "var(--color-secondary-dark, #c49a2a)" }}
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 13H4a1 1 0 0 1 0-2h.07A8 8 0 0 1 11 4.07V4a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 11H20a1 1 0 0 1 0 2h-.07A8 8 0 0 1 13 16.93Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Processing your entry
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Usually takes under a minute
        </p>
      </div>
    </div>
  );
}

export function FailedCard() {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: "var(--card)",
        border: "1px solid color-mix(in srgb, var(--destructive) 30%, transparent)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "color-mix(in srgb, var(--destructive) 10%, transparent)" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ fill: "var(--destructive)" }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Something went wrong
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Recording saved — we'll retry processing
        </p>
      </div>
    </div>
  );
}