const ROTATIONS = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 0.5];
const ACCENT_COLORS = [
  { bg: "var(--color-secondary-light, #f3d98e)", color: "var(--color-neutral-800)" },
  { bg: "var(--color-tertiary-light, #f8c090)",  color: "var(--color-neutral-800)" },
  { bg: "var(--color-neutral-200)",              color: "var(--color-neutral-800)" },
  { bg: "var(--color-primary)",                  color: "#fff"                     },
];

interface Props {
  themes: string[];
  pattern: string | null;
}

export default function ThemesSection({ themes, pattern }: Props) {
  if (themes.length === 0 && !pattern) return null;

  return (
    <div className="px-5 mb-8">
      {themes.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ color: "var(--color-neutral-500)" }}
            >
              ◈ themes
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-neutral-200)" }}
            />
          </div>

          {/* Scattered theme pills */}
          <div className="flex flex-wrap gap-2.5">
            {themes.map((theme, i) => {
              const rot   = ROTATIONS[i % ROTATIONS.length];
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <span
                  key={theme}
                  className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold capitalize inline-block"
                  style={{
                    // transform: `rotate(${rot}deg)`,
                    background: color.bg,
                    color: color.color,
                    transition: "transform 0.2s ease",
                  }}
                >
                  {theme}
                </span>
              );
            })}
          </div>
        </>
      )}

      {/* Pattern */}
      {pattern && (
        <div
          className="mt-6 flex items-start gap-3 p-4 rounded-2xl"
          style={{
            background: "var(--color-neutral-100)",
            border: "1px dashed var(--color-neutral-300)",
          }}
        >
          <span className="text-lg mt-0.5 shrink-0">↻</span>
          <div>
            <p
              className="text-[9px] font-black uppercase tracking-[0.2em] mb-1"
              style={{ color: "var(--color-neutral-500)" }}
            >
              recurring pattern
            </p>
            <p
              className="text-[14px] font-semibold leading-snug capitalize"
              style={{ color: "var(--color-neutral-800)" }}
            >
              {pattern}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}