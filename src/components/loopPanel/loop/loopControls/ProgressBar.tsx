import { FC, useState, useEffect } from "react";
import { now } from "tone";
import { useLoopStore } from "@data/store/LoopStore.ts";
import {
  TrackIndex,
  LoopState_Rec,
  LoopState_Pause,
} from "@data/store/LoopStoreTypes.ts";

export type T_ProgressBar = {
  trackIndex: TrackIndex;
};

export const ProgressBar: FC<T_ProgressBar> = ({ trackIndex }) => {
  const track = useLoopStore((state) => state.trackArray[trackIndex]);
  const bpm = useLoopStore((state) => state.bpm);
  const measure = useLoopStore((state) => state.measure);

  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(now());

  useEffect(() => {
    if (!track?.player || !bpm || !measure) return;

    if (track.state_rec === LoopState_Rec.Recording) return;

    const loopDuration = (measure * 60) / bpm;

    const nextStartTime = Math.floor(now() / loopDuration) * loopDuration;
    setStartTime(nextStartTime);

    const updateProgress = () => {
      const elapsed = now() - startTime;
      let newProgress = 100 - (elapsed / loopDuration) * 100;

      if (newProgress < 0) newProgress = 0;
      if (newProgress > 100) newProgress = 100;

      if (elapsed >= loopDuration) {
        setStartTime(now());
        newProgress = 100;
      }

      setProgress(newProgress);
    };

    if (track.state_pause === LoopState_Pause.Paused) {
      setProgress(100);
      return;
    }

    const interval = setInterval(updateProgress, 10);

    return () => clearInterval(interval);
  }, [
    track?.player,
    track.state_pause,
    track.state_rec,
    bpm,
    measure,
    startTime,
  ]);

  useEffect(() => {
    if (
      track.state_pause === LoopState_Pause.Paused &&
      track.state_rec === LoopState_Rec.Idle
    ) {
      setProgress(0);
    }
  }, [track.state_pause, track.state_rec]);

  return (
    <div className="flex flex-row items-end bg-[#353535] w-5 mt-1 ml-9 h-35 rounded-2xl shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden">
      <div
        className="bg-violet-600 w-full rounded-2xl"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
};
