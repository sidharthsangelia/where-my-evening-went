export default function FutureDay() {
  return (
    <div
      className="rounded-2xl border-2 border-dashed p-5 flex items-center gap-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--muted)" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ fill: "var(--muted-foreground)" }}
        >
          <path d="M17 12h-5v5h5v-5ZM16 1v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1h-2Zm3 18H5V8h14v11Z" />
        </svg>
      </div>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Nothing here yet — check back later.
      </p>
    </div>
  );
}