// components/WaveformPreview.tsx
"use client";

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

type Props = {
  blob: Blob;
};

export default function WaveformPreview({ blob }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const url = URL.createObjectURL(blob);

    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#9ca3af",
      progressColor: "#111827",
      cursorColor: "#111827",
      barWidth: 2,
      barRadius: 2,
      height: 80,
      normalize: true,
    });

    waveSurferRef.current.load(url);

    return () => {
      waveSurferRef.current?.destroy();
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return <div
  ref={containerRef}
  onClick={() => waveSurferRef.current?.playPause()}
  className="cursor-pointer"
/>;
}
