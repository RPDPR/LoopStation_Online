import { create } from "zustand";
import * as Tone from "tone";

interface Bundle {
  bundleName: string;
  bundleParams: { fxs: { fxName: string; fx: Tone.ToneAudioNode }[] | [] };
}

interface FXStore {
  bundleArray: Bundle[];
  reverb_FX: (
    bundleIndex: number,
    FX_Params: {
      decay: number;
      preDelay: number;
      wet: number;
    }
  ) => void;
}
export const useFXStore = create<FXStore>((set, get) => ({
  bundleArray: [],
  reverb_FX: (
    bundleIndex,
    params: { decay: number; preDelay: number; wet: number }
  ) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleIndex];

    const reverb = new Tone.Reverb(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: "reverb", fx: reverb },
      ];
      newBundleArray[bundleIndex] = {
        ...bundle,
        bundleParams: { fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
}));
