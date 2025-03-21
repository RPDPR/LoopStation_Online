import React, { useState, useEffect, useRef } from "react";
import { useLoopStore } from "../../../../data/store/LoopStore.ts";

export const ProgressBar: React.FC<{ trackIndex: number }> = ({
  trackIndex,
}) => {
  const tracks = useLoopStore((state) => state.tracks);
  const track = tracks?.[trackIndex];

  const [heightValue, setHeightValue] = useState(0);
  const [fullTime, setFullTime] = useState(4);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!track?.buffer || !track?.player) {
      setHeightValue(0);
      return;
    }

    setFullTime(track.buffer.duration);
    setHeightValue(100); // Начинаем с полной высоты

    const updateProgress = () => {
      if (!track.player || track.player.state !== "started") return;

      const currentTime = track.player.seek(0, "0");
      if (typeof currentTime !== "number") return;

      const progress = 100 - (100 * currentTime) / fullTime;
      setHeightValue(progress);

      animationRef.current = requestAnimationFrame(updateProgress);
    };

    // Проверяем, если трек играет, обновляем прогресс
    if (track.player.state === "started") {
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [track?.player, track?.buffer, fullTime]);

  return (
    <div className="flex flex-row items-end bg-[#353535] w-5 mt-1 ml-9 h-35 rounded-2xl shadow-[0_0_20px_rgba(20,20,20,0.3)]">
      <div
        className="bg-violet-600 w-full rounded-2xl transition-[height] duration-100"
        style={{ height: `${heightValue}%` }}
      />
    </div>
  );
};
