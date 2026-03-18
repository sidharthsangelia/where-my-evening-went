'use client'

import { cn } from '@/lib/utils'
import BlobCharacter from './BlobCharacter'
import { MOODS, getMood } from './moods'
import type { MoodId } from './types'

interface MoodStepProps {
  selected: MoodId | null
  onSelect: (id: MoodId) => void
  onNext: () => void
}

export default function MoodStep({ selected, onSelect, onNext }: MoodStepProps) {
  const mood = getMood(selected)
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    /*
     * Layout strategy (mobile-first):
     *   - Outer: full height flex column, overflow-y-auto so nothing is clipped
     *   - Blob: capped height so it never pushes content off screen
     *   - Pills + button: live in a natural-flow section at the bottom
     *   - On small phones the blob shrinks; on tall phones it looks generous
     */
    <div className="flex flex-col h-full ">
      {/* ── Blob ── */}
      <div className="flex justify-center items-end px-8 pt-2 pb-0"
        style={{ minHeight: '200px', maxHeight: '42vh' }}>
        <div
          className="w-full max-w-[260px] transition-opacity duration-500"
          style={{ opacity: selected ? 1 : 0.5 }}
        >
          <BlobCharacter mood={selected ? mood : MOODS[0]} />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 pt-4 pb-8 flex flex-col gap-4 ">
        {/* Heading */}
        <div>
          <h1 className="text-white text-[26px] font-extrabold leading-tight tracking-tight">
            How was your evening?
          </h1>
          <p className="text-white/60 text-sm mt-0.5">{today}</p>
        </div>

        {/* Mood pills — 4-column grid */}
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => {
            const isSelected = selected === m.id
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                aria-pressed={isSelected}
                className={cn(
                  'py-2 px-1 rounded-full text-xs font-bold tracking-wide',
                  'border transition-all duration-200 active:scale-95 select-none',
                  isSelected
                    ? 'scale-105 shadow-md border-transparent'
                    : 'bg-white/15 text-white border-white/20 hover:bg-white/25',
                )}
                style={
                  isSelected
                    ? { background: m.pillBg, color: m.pillText }
                    : {}
                }
              >
                {m.label}
              </button>
            )
          })}
        </div>

        {/* CTA — always visible, disabled until selection */}
        <button
          onClick={onNext}
          disabled={!selected}
          className={cn(
            'w-full py-4 rounded-2xl font-extrabold text-base',
            'transition-all duration-200 active:scale-[0.98]',
            selected
              ? 'bg-white text-gray-900 shadow-lg'
              : 'bg-white/20 text-white/40 cursor-not-allowed',
          )}
        >
          {selected
            ? `Feeling ${mood.label.toLowerCase()} — next →`
            : 'Pick a mood to continue'}
        </button>
      </div>
    </div>
  )
}