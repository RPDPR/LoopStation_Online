import { create } from "zustand";
import * as Tone from "tone";
import { FX_ParamsTypes } from "@data/store/FX_ParamsTypes.ts";

export const fxNames = {
  Reverb: "Reverb",
  Distortion: "Distortion",
  FeedbackDelay: "FeedbackDelay",
} as const;

export type fxNames = (typeof fxNames)[keyof typeof fxNames];

type T_bundleOutputGain = {
  gainValue: number;
  gainNode: Tone.ToneAudioNode;
  min: number;
  max: number;
  step?: number;
};
type T_bundleDryWet = {
  dryWetValue: number;
  dryWetNode: Tone.ToneAudioNode;
  min: number;
  max: number;
  step?: number;
};

export interface Bundle {
  bundleID: number;
  bundleName: string;
  bundleIsSelected: boolean;
  bundleParams: {
    fxs:
      | {
          fxID: number;
          fxName: fxNames;
          fxIsSelected: boolean;
          fx: Tone.ToneAudioNode | null;
        }[];
    outputGain: T_bundleOutputGain;
    dryWet: T_bundleDryWet;
  };
}

interface FXStore {
  bundleArray: Bundle[];
  addBundle: () => void;
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
  addFX: (bundleID: Bundle["bundleID"], fxName: fxNames) => void;
  setFXSelection: (
    bundleID: Bundle["bundleID"],
    fxID: Bundle["bundleParams"]["fxs"][number]["fxID"],
    isSelected: boolean
  ) => void;

  reverb_FX: (
    bundleID: number,
    isEditing: boolean,
    FX_Params: FX_ParamsTypes["reverb"]
  ) => void;
  distortion_FX: (
    bundleID: number,
    isEditing: boolean,
    FX_Params: FX_ParamsTypes["distortion"]
  ) => void;
  feedbackDelay_FX: (
    bundleID: number,
    isEditing: boolean,
    FX_Params: FX_ParamsTypes["feedbackDelay"]
  ) => void;
}
export const useFXStore = create<FXStore>((set, get) => ({
  bundleArray: [],
  addBundle: () => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];

      const newBundleObject: Bundle = {
        bundleID: Number(newBundleArray.length),
        bundleName: "Bundle_" + String(newBundleArray.length + 1),
        bundleIsSelected: false,
        bundleParams: {
          fxs: [],
          outputGain: {
            gainValue: 50,
            gainNode: new Tone.Gain(1),
            min: 0,
            max: 100,
            step: 0.1,
          },
          dryWet: {
            dryWetValue: 50,
            dryWetNode: new Tone.CrossFade(0.5),
            min: 0,
            max: 100,
            step: 0.1,
          },
        },
      };

      newBundleArray.push(newBundleObject);

      return { bundleArray: newBundleArray };
    });
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
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleParams: Bundle["bundleParams"] = {
        ...bundle.bundleParams,
      };

      if (params.gainValue !== undefined) {
        const gainValue =
          params.gainValue <= 50
            ? params.gainValue / 50
            : 1 + (params.gainValue - 50) * 0.06;

        const gain = new Tone.Gain(gainValue);
        newBundleParams.outputGain = {
          ...newBundleParams.outputGain,
          gainValue: params.gainValue,
          gainNode: gain,
        };
      }

      if (params.dryWetValue !== undefined) {
        const dryWet = new Tone.CrossFade(params.dryWetValue / 100);
        newBundleParams.dryWet = {
          ...newBundleParams.dryWet,
          dryWetValue: params.dryWetValue,
          dryWetNode: dryWet,
        };
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: newBundleParams,
      };
      return { bundleArray: newBundleArray };
    });
  },
  addFX: (bundleID: Bundle["bundleID"], fxName: fxNames) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];

      if (bundle.bundleParams.fxs.find((fx) => fx.fxName === fxName))
        return { bundleArray: newBundleArray };

      const newFxObject = {
        fxID: Number(bundle.bundleParams.fxs.length),
        fxName: fxName,
        fxIsSelected: false,
        fx: null,
      };

      bundle.bundleParams.fxs.push(newFxObject);

      newBundleArray[bundleID] = {
        ...bundle,
      };
      return { bundleArray: newBundleArray };
    });
  },
  setFXSelection: (
    bundleID: Bundle["bundleID"],
    fxID: Bundle["bundleParams"]["fxs"][number]["fxID"],
    isSelected: Bundle["bundleParams"]["fxs"][number]["fxIsSelected"]
  ) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];

      if (bundle.bundleParams.fxs[fxID]) {
        bundle.bundleParams.fxs[fxID] = {
          ...bundle.bundleParams.fxs[fxID],
          fxIsSelected: isSelected,
        };
      }

      newBundleArray[bundleID] = {
        ...bundle,
      };
      return { bundleArray: newBundleArray };
    });
  },

  reverb_FX: (bundleID, isEditing, params: FX_ParamsTypes["reverb"]) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];
    let reverb: Tone.ToneAudioNode;

    if (isEditing) {
      reverb = new Tone.Reverb(params);
    } else {
      reverb = new Tone.Reverb(params);
    }

    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        {
          fxID: Number(bundle.bundleParams.fxs.length),
          fxName: fxNames.Reverb,
          fxIsSelected: false,
          fx: reverb,
        },
      ];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  distortion_FX: (
    bundleID,
    isEditing,
    params: FX_ParamsTypes["distortion"]
  ) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];
    let distortion: Tone.ToneAudioNode;

    if (isEditing) {
      distortion = new Tone.Distortion(params);
    } else {
      distortion = new Tone.Distortion(params);
    }

    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        {
          fxID: Number(bundle.bundleParams.fxs.length),
          fxName: fxNames.Distortion,
          fxIsSelected: false,
          fx: distortion,
        },
      ];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  feedbackDelay_FX: (
    bundleID,
    isEditing,
    params: FX_ParamsTypes["feedbackDelay"]
  ) => {
    const bundles = get().bundleArray;
    const bundle = bundles[bundleID];
    let feedbackDelay: Tone.ToneAudioNode;

    if (isEditing) {
      feedbackDelay = new Tone.FeedbackDelay(params);
    } else {
      feedbackDelay = new Tone.FeedbackDelay(params);
    }

    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const newBundleFXs = [
        ...(bundle.bundleParams.fxs || []),
        {
          fxID: Number(bundle.bundleParams.fxs.length),
          fxName: fxNames.FeedbackDelay,
          fxIsSelected: false,
          fx: feedbackDelay,
        },
      ];
      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
}));
