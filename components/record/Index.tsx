"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import MoodStep from "./MoodStep";
import RecordStep from "./RecordStep";
import PhotoStep from "./PhotoStep";
import { UploadingStep, DoneStep } from "./StatusSteps";
import { getMood, getMoodGradient } from "./moods";
import type { EveningCheckInProps, MoodId, Step } from "./types";

// Steps that show the progress dots
const PROGRESS_STEPS: Step[] = ["mood", "record", "photo"];

// Steps where back navigation is allowed
const BACK_ALLOWED: Step[] = ["record", "photo"];

// Step that you go back to from each step
const BACK_DESTINATION: Partial<Record<Step, Step>> = {
  record: "mood",
  photo: "record",
};

export default function EveningCheckIn({
  recorder,
  upload,
  currentStep,
  onStepChange,
  onMoodSelected,
  onRecordingDone,
  onSaveWithPhoto,
  onSaveWithoutPhoto,
  isSignedIn,
}: EveningCheckInProps & { isSignedIn: boolean }) {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const mood = getMood(selectedMood);

  const handleMoodSelect = (id: MoodId) => {
    setSelectedMood(id);
    onMoodSelected(id);
  };

  const handleStopRecording = () => {
    recorder.onStopRecording();
    onRecordingDone();
    onStepChange("photo");
  };

  const handleSave = (file?: File) => {
    onStepChange("uploading");
    if (file) {
      onSaveWithPhoto(file);
    } else {
      onSaveWithoutPhoto();
    }
  };

  const handleBack = () => {
    const dest = BACK_DESTINATION[currentStep];
    if (dest) onStepChange(dest);
  };

  const bgStyle = {
    background: selectedMood
      ? getMoodGradient(mood)
      : "linear-gradient(160deg, #2d2d3a 0%, #1a1a28 100%)",
    transition: "background 0.6s ease",
  };

  return (
    <div
      className="relative w-full h-[100dvh] max-w-[430px] mx-auto flex flex-col overflow-hidden"
      style={bgStyle}
    >
      {/* ── Top bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-2 ">
        {/* <span className="text-white text-base font-bold tracking-tight opacity-90">
          Where My Evening Went
        </span> */}

        {PROGRESS_STEPS.includes(currentStep) && (
          <div className="shrink-0 flex justify-center gap-2 pb-1">
            {PROGRESS_STEPS.map((s, i) => {
              const current = PROGRESS_STEPS.indexOf(currentStep);
              return (
                <div
                  key={s}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === current
                      ? "w-6 h-2 bg-white"
                      : i < current
                        ? "w-2 h-2 bg-white/60"
                        : "w-2 h-2 bg-white/25",
                  )}
                />
              );
            })}
          </div>
        )}
        {BACK_ALLOWED.includes(currentStep) && (
          <button
            onClick={handleBack}
            className="text-white/60 text-sm hover:text-white/90 transition-colors"
          >
            ← back
          </button>
        )}
      </div>

      {/* ── Step progress dots ── */}

      {/* ── Step content ── */}
      <div className="flex-1 min-h-0">
        {currentStep === "mood" && (
          <MoodStep
            selected={selectedMood}
            onSelect={handleMoodSelect}
            onNext={() => onStepChange("record")}
          />
        )}

        {currentStep === "record" && (
          <RecordStep
            recorder={{ ...recorder, onStopRecording: handleStopRecording }}
            mood={mood}
          />
        )}

        {currentStep === "photo" && (
          <PhotoStep
            audioUploadProgress={upload.audioUploadProgress}
            isAudioUploading={upload.isAudioUploading}
            isSignedIn={isSignedIn}
            onSave={handleSave}
          />
        )}

        {currentStep === "uploading" && (
          <UploadingStep
            audioProgress={upload.audioUploadProgress}
            photoProgress={upload.photoUploadProgress}
            mood={mood}
          />
        )}

        {currentStep === "done" && <DoneStep mood={mood} />}
      </div>
    </div>
  );
}
