interface Props {
  insight: string | null;
}

export default function InsightOracle({ insight }: Props) {
  if (!insight) return null;

  return (
    <div className="px-5 mb-8">
      <div
        className="relative rounded-[20px] p-5 overflow-hidden"
        style={{
          background: "var(--color-primary)",
          // subtle grain via repeating gradient
          backgroundImage: `
            var(--color-primary),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")
          `,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />

        {/* Label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-60 text-white">
            ◈ oracle
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Insight text */}
        <p
          className="text-[17px] leading-[1.6] font-medium"
          style={{
            color: "rgba(255,255,255,0.92)",
            fontFamily: "var(--font-display)",
          }}
        >
          {insight}
        </p>

        {/* Three star dots */}
        <div className="flex gap-1.5 mt-5 opacity-40">
          {["★", "★", "★"].map((s, i) => (
            <span key={i} className="text-[8px] text-white">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}