// components/Mic.tsx
"use client";

import { useAudioRecorder } from "@/lib/useAudioRecorder";
import { useState, useEffect } from "react";

export default function Mic({ onRecordingComplete }: { 
  onRecordingComplete: (blob: Blob) => void 
}) {
  const { recordingBlob, isRecording, startRecording, stopRecording } =
    useAudioRecorder();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const MAX_SECONDS = 3 * 60;

  // Timer logic (same as before)
  useEffect(() => {
    if (!isRecording) {
      setSecondsElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (secondsElapsed >= MAX_SECONDS) {
      stopRecording();
    }
  }, [secondsElapsed, stopRecording]);

  // When recording completes, pass blob up to parent
  useEffect(() => {
    if (recordingBlob) {
      onRecordingComplete(recordingBlob);
    }
  }, [recordingBlob, onRecordingComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {!isRecording ? (
        <button onClick={startRecording}>
          🎙 Start Recording
        </button>
      ) : (
        <>
          <p className="text-2xl font-mono">
            {formatTime(MAX_SECONDS - secondsElapsed)} remaining
          </p>
          <button onClick={stopRecording}>⏹ Stop</button>
        </>
      )}
    </div>
  );
}