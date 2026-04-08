"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  durationSeconds?: number | null;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, durationSeconds }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(durationSeconds ?? 0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onLoad = () => setDuration(el.duration);
    const onEnd  = () => { setPlaying(false); setCurrent(0); };

    el.addEventListener("timeupdate",  onTime);
    el.addEventListener("loadedmetadata", onLoad);
    el.addEventListener("ended",       onEnd);
    return () => {
      el.removeEventListener("timeupdate",  onTime);
      el.removeEventListener("loadedmetadata", onLoad);
      el.removeEventListener("ended",       onEnd);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else         { el.play(); setPlaying(true); }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrent(t);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-full bg-white border border-[#e8e4da]">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause button */}
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          // Pause icon
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <rect x="5"  y="4" width="4" height="16" rx="1" />
            <rect x="15" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play icon — nudged right optically
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white translate-x-px">
            <path d="M8 5.14v14l11-7-11-7Z" />
          </svg>
        )}
      </button>

      {/* Track info + scrubber */}
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#b0a89e] mb-1.5">
          Reflection Audio
        </p>

        {/* Scrubber */}
        <div className="relative h-1 rounded-full bg-[#e8e4da] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#1c1c1c] transition-all"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={current}
            onChange={seek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Duration */}
      <span className="text-[11px] font-semibold tabular-nums text-[#9a9185] shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  );
}