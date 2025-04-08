import { create } from "zustand";
import * as Tone from "tone";
import { FX_ParamsTypes } from "./FX_ParamsTypes.ts";

export const fxNames = {
  Reverb: "Reverb",
  Distortion: "Distortion",
  JCReverb: "JCReverb",
  FeedbackDelay: "FeedbackDelay",
} as const;

export type fxNames = (typeof fxNames)[keyof typeof fxNames];

export interface Bundle {
  bundleID: number;
  bundleName: string;
  bundleIsActive: boolean;
  bundleParams: {
    fxs: { fxName: fxNames; fx: Tone.ToneAudioNode }[] | [];
  };
}

interface FXStore {
  bundleArray: Bundle[];
  addBundle: (bundle: Bundle) => void;
  setBundleActivity: (bundleID: Bundle["bundleID"], isActive: boolean) => void;

  reverb_FX: (bundleIndex: number, FX_Params: FX_ParamsTypes["reverb"]) => void;
  distortion_FX: (
    bundleIndex: number,
    FX_Params: FX_ParamsTypes["distortion"]
  ) => void;
  feedbackDelay_FX: (
    bundleIndex: number,
    FX_Params: FX_ParamsTypes["feedbackDelay"]
  ) => void;
}
export const useFXStore = create<FXStore>((set, get) => ({
  bundleArray: [],
  addBundle: (bundle: Bundle) => {
    const newBundleArray = [...get().bundleArray];
    newBundleArray.push(bundle);
    set({ bundleArray: newBundleArray });
  },

  setBundleActivity: (bundleID: Bundle["bundleID"], isActive: boolean) => {
    const newBundleArray = [...get().bundleArray];

    if (newBundleArray[bundleID]) {
      newBundleArray[bundleID] = {
        ...newBundleArray[bundleID],
        bundleIsActive: isActive,
      };
    }

    set({ bundleArray: newBundleArray });
  },

  reverb_FX: (bundleIndex, params: FX_ParamsTypes["reverb"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleIndex];

    const reverb = new Tone.Reverb(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: fxNames.Reverb, fx: reverb },
      ];
      newBundleArray[bundleIndex] = {
        ...bundle,
        bundleParams: { fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  distortion_FX: (bundleIndex, params: FX_ParamsTypes["distortion"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleIndex];

    const distortion = new Tone.Distortion(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: fxNames.Distortion, fx: distortion },
      ];
      newBundleArray[bundleIndex] = {
        ...bundle,
        bundleParams: { fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  feedbackDelay_FX: (bundleIndex, params: FX_ParamsTypes["feedbackDelay"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleIndex];

    const feedbackDelay = new Tone.FeedbackDelay(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: fxNames.FeedbackDelay, fx: feedbackDelay },
      ];
      newBundleArray[bundleIndex] = {
        ...bundle,
        bundleParams: { fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
}));
