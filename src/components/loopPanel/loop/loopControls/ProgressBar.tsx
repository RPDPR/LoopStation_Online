import { useState, useEffect } from "react";
import {
  useLoopStore,
  LoopState_Rec,
  LoopState_Pause,
} from "../../../../data/store/LoopStore.ts";
import * as Tone from "tone";

export const ProgressBar = ({ trackIndex }: { trackIndex: number }) => {
  const track = useLoopStore((state) => state.tracks[trackIndex]);
  const bpm = useLoopStore((state) => state.bpm);
  const measure = useLoopStore((state) => state.measure);

  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(Tone.now());

  useEffect(() => {
    if (!track?.player || !bpm || !measure) return;

    if (track.state_rec === LoopState_Rec.Recording) return;

    const loopDuration = (measure * 60) / bpm;

    const nextStartTime = Math.floor(Tone.now() / loopDuration) * loopDuration;
    setStartTime(nextStartTime);

    const updateProgress = () => {
      const elapsed = Tone.now() - startTime;
      let newProgress = 100 - (elapsed / loopDuration) * 100;

      if (newProgress < 0) newProgress = 0;
      if (newProgress > 100) newProgress = 100;

      if (elapsed >= loopDuration) {
        setStartTime(Tone.now());
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
