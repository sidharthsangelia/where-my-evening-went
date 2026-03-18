// ─── Domain types for the evening check-in flow ───────────────────────────────
// Keep all types here so every module imports from one place.
// If you add a new step or mood, this is the only file you touch for types.

export type MoodId =
  | 'happy'
  | 'excited'
  | 'anxious'
  | 'calm'
  | 'sad'
  | 'tired'
  | 'grateful'
  | 'reflective'

// Steps in order. 'uploading' and 'done' are terminal — no back navigation.
export type Step = 'mood' | 'record' | 'photo' | 'uploading' | 'done'

export type EyeStyle =
  | 'wide'
  | 'excited'
  | 'worried'
  | 'peaceful'
  | 'sad'
  | 'sleepy'
  | 'warm'
  | 'pensive'

export type MouthStyle =
  | 'bigGrin'
  | 'openJoy'
  | 'wobbly'
  | 'serene'
  | 'downturn'
  | 'flat'
  | 'soft'
  | 'pursed'

export type AccessoryType = 'stars' | 'sweat' | 'zzz' | 'heart' | 'sparkle'

export interface Mood {
  id: MoodId
  label: string
  // SVG colors
  blobFill: string
  topFill: string
  // Selected pill colors
  pillBg: string
  pillText: string
  // Blob face config
  eyeStyle: EyeStyle
  mouthStyle: MouthStyle
  accessory?: AccessoryType
}

// Props passed down from page.tsx into EveningCheckIn
export interface RecorderProps {
  isRecording: boolean
  secondsElapsed: number
  maxSeconds: number
  onStartRecording: () => void
  onStopRecording: () => void
}

export interface UploadProps {
  audioUploadProgress: number // 0–1
  isAudioUploading: boolean
  photoUploadProgress: number // 0–1
  isPhotoUploading: boolean
  isSaved: boolean
}

export interface EveningCheckInProps {
  recorder: RecorderProps
  upload: UploadProps
  currentStep: Step
  onStepChange: (step: Step) => void
  onMoodSelected: (mood: MoodId) => void
  onRecordingDone: () => void
  onSaveWithPhoto: (file: File) => void
  onSaveWithoutPhoto: () => void
}