import { create } from "zustand";
import * as Tone from "tone";
import { FX_ParamsTypes } from "./FX_ParamsTypes.ts";

export const fxNames = {
  Reverb: "Reverb",
  Distortion: "Distortion",
  FeedbackDelay: "FeedbackDelay",
} as const;

export type fxNames = (typeof fxNames)[keyof typeof fxNames];

export interface Bundle {
  bundleID: number;
  bundleName: string;
  bundleIsSelected: boolean;
  bundleParams: {
    fxs: { fxName: fxNames; fx: Tone.ToneAudioNode }[] | [];
    outputGain: Tone.ToneAudioNode | null;
    dryWet: Tone.ToneAudioNode | null;
  };
}

interface FXStore {
  bundleArray: Bundle[];
  addBundle: (bundle: Bundle) => void;
  setBundleSelection: (
    bundleID: Bundle["bundleID"],
    isSelected: boolean
  ) => void;
  setBundleName: (bundleID: Bundle["bundleID"], bundleName: string) => void;
  setBundleParams: (
    bundleID: Bundle["bundleID"],
    params: {
      gainValue?: number;
      dryWetValue?: number;
    }
  ) => void;
  reverb_FX: (bundleID: number, FX_Params: FX_ParamsTypes["reverb"]) => void;
  distortion_FX: (
    bundleID: number,
    FX_Params: FX_ParamsTypes["distortion"]
  ) => void;
  feedbackDelay_FX: (
    bundleID: number,
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

  setBundleSelection: (bundleID: Bundle["bundleID"], isSelected: boolean) => {
    const newBundleArray = [...get().bundleArray];

    if (newBundleArray[bundleID]) {
      newBundleArray[bundleID] = {
        ...newBundleArray[bundleID],
        bundleIsSelected: isSelected,
      };
    }

    set({ bundleArray: newBundleArray });
  },

  setBundleName: (bundleID: Bundle["bundleID"], bundleName: string) => {
    const newBundleArray = [...get().bundleArray];

    if (newBundleArray[bundleID]) {
      newBundleArray[bundleID] = {
        ...newBundleArray[bundleID],
        bundleName: bundleName,
      };
    }

    set({ bundleArray: newBundleArray });
  },

  setBundleParams: (
    bundleID: Bundle["bundleID"],
    params: {
      gainValue?: number;
      dryWetValue?: number;
    }
  ) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];

    const newBundleParams = {
      ...bundle.bundleParams,
    };

    if (params.gainValue !== undefined) {
      const gainValue =
        params.gainValue <= 50
          ? params.gainValue / 50
          : 1 + (params.gainValue - 50) * 0.06;

      const gain = new Tone.Gain(gainValue);
      newBundleParams.outputGain = gain;
    }

    if (params.dryWetValue !== undefined) {
      const dryWet = new Tone.CrossFade(params.dryWetValue / 100);
      newBundleParams.dryWet = dryWet;
    }

    set((state) => {
      const newBundleArray = [...state.bundleArray];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: newBundleParams,
      };
      return { bundleArray: newBundleArray };
    });
  },

  reverb_FX: (bundleID, params: FX_ParamsTypes["reverb"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];

    const reverb = new Tone.Reverb(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: fxNames.Reverb, fx: reverb },
      ];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  distortion_FX: (bundleID, params: FX_ParamsTypes["distortion"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];

    const distortion = new Tone.Distortion(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: fxNames.Distortion, fx: distortion },
      ];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  feedbackDelay_FX: (bundleID, params: FX_ParamsTypes["feedbackDelay"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];

    const feedbackDelay = new Tone.FeedbackDelay(params);
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        { fxName: fxNames.FeedbackDelay, fx: feedbackDelay },
      ];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
}));
