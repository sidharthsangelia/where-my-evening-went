import type { Mood } from './types'

// ─── Mood definitions ──────────────────────────────────────────────────────────
// Adding a new mood = add one object here. Nothing else changes.
// blobFill  → the main body color of the SVG character
// topFill   → the scalloped "hat" on top of the blob
// pillBg    → highlight color when this mood pill is selected
// pillText  → text color inside the selected pill (should contrast pillBg)

export const MOODS: Mood[] = [
  {
    id: 'happy',
    label: 'Happy',
    blobFill: '#F5C842',
    topFill: '#E8702A',
    pillBg: '#F5C842',
    pillText: '#7A4800',
    eyeStyle: 'wide',
    mouthStyle: 'bigGrin',
    accessory: 'stars',
  },
  {
    id: 'excited',
    label: 'Excited',
    blobFill: '#FF6B35',
    topFill: '#D93A5A',
    pillBg: '#FF6B35',
    pillText: '#6B0A18',
    eyeStyle: 'excited',
    mouthStyle: 'openJoy',
    accessory: 'sparkle',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    blobFill: '#5B8DD9',
    topFill: '#2D5A9E',
    pillBg: '#5B8DD9',
    pillText: '#0A1F4A',
    eyeStyle: 'worried',
    mouthStyle: 'wobbly',
    accessory: 'sweat',
  },
  {
    id: 'calm',
    label: 'Calm',
    blobFill: '#5EC49A',
    topFill: '#2E9E74',
    pillBg: '#5EC49A',
    pillText: '#0A3D28',
    eyeStyle: 'peaceful',
    mouthStyle: 'serene',
  },
  {
    id: 'sad',
    label: 'Sad',
    blobFill: '#7B90D4',
    topFill: '#3D4F8A',
    pillBg: '#7B90D4',
    pillText: '#0E1535',
    eyeStyle: 'sad',
    mouthStyle: 'downturn',
  },
  {
    id: 'tired',
    label: 'Tired',
    blobFill: '#B090DC',
    topFill: '#6A50A0',
    pillBg: '#9B7EC8',
    pillText: '#1E0A40',
    eyeStyle: 'sleepy',
    mouthStyle: 'flat',
    accessory: 'zzz',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    blobFill: '#F090A4',
    topFill: '#C04A6A',
    pillBg: '#E8768A',
    pillText: '#5A0A22',
    eyeStyle: 'warm',
    mouthStyle: 'soft',
    accessory: 'heart',
  },
  {
    id: 'reflective',
    label: 'Reflective',
    blobFill: '#8AAAB8',
    topFill: '#3E5C6A',
    pillBg: '#8AAAB8',
    pillText: '#0A1E28',
    eyeStyle: 'pensive',
    mouthStyle: 'pursed',
  },
]

// Lookup helper so you never have to .find() inline
export function getMood(id: string | null): Mood {
  return MOODS.find((m) => m.id === id) ?? MOODS[0]
}

// The background gradient for the full-screen wrapper
export function getMoodGradient(mood: Mood): string {
  return `linear-gradient(160deg, ${mood.blobFill} 0%, ${mood.topFill} 100%)`
}