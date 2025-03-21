import { create } from "zustand";
import * as Tone from "tone";
import { useLoopStore } from "./LoopStore.ts";

interface FXStore {
  reverb_FX: (trackIndex: number) => void;
}

export const useFXStore = create<FXStore>(() => ({
  reverb_FX: (trackIndex: number) => {
    const { tracks } = useLoopStore.getState();
    const track = tracks[trackIndex];

    if (!track.player) return;

    if (track.buffer) {
      const pitchShift = new Tone.PitchShift(-12);
      const eq = new Tone.EQ3({ low: +18, mid: -3, high: -18 });
      const distortion = new Tone.Distortion(0.3);
      const reverb = new Tone.Reverb({ decay: 2, wet: 0.2 });

      track.player.disconnect();

      track.player.chain(
        pitchShift,
        eq,
        distortion,
        reverb,
        Tone.getDestination()
      );
    }
  },
}));
