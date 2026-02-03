"use client";

import { useEffect, useRef, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import WaveformPreview from "./WaveFormPreview";

type Props = {
  onRecorded?: (blob: Blob) => void;
};

export default function VoiceRecorder({ onRecorded }: Props) {
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // timer logic
  useEffect(() => {
    if (!isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl border bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-black text-center">
        Record your evening 🎙️
      </h2>

      <ReactMediaRecorder
        audio
        onStart={() => {
          setIsRecording(true);
          setSeconds(0);
          setRecordedBlob(null);
        }}
        onStop={(_, blob) => {
          setIsRecording(false);
          setRecordedBlob(blob);
          onRecorded?.(blob);
        }}
        render={({ startRecording, stopRecording }) => (
          <div className="flex flex-col items-center gap-4">
            {/* TIMER */}
            <div className="text-2xl font-mono text-gray-700">
              {formatTime(seconds)}
            </div>

            {/* RECORD BUTTON */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center shadow-lg"
              >
                REC
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center shadow-lg animate-pulse"
              >
                STOP
              </button>
            )}
          </div>
        )}
      />

      {/* PREVIEW */}
      {recordedBlob && (
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm text-gray-500">Preview</p>

          <WaveformPreview blob={recordedBlob} />

          <button
            onClick={() => setRecordedBlob(null)}
            className="text-sm text-gray-500 underline"
          >
            Re-record
          </button>
        </div>
      )}
    </div>
  );
}
