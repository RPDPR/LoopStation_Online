import { create } from "zustand";
import * as Tone from "tone";
import {
  BundleID,
  BundleName,
  BundleIsSelected,
  BundleParams,
  Fxs,
  FxID,
  FxName,
  FxIsSelected,
  FxNode,
  OutputGain,
  DryWet,
  T_FX_Node,
} from "@data/store/FXStoreTypes.ts";
import { FX_ParamsTypes } from "@data/store/FX_ParamsTypes.ts";

// TYPES DEFINITION /////
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
    fxs: {
      fxID: FX_ParamsTypes[keyof FX_ParamsTypes]["id"];
      fxName: FX_ParamsTypes[keyof FX_ParamsTypes]["name"] | null;
      fxIsSelected: boolean;
      fxNode: Tone.ToneAudioNode | null;
    }[];
    outputGain: T_bundleOutputGain;
    dryWet: T_bundleDryWet;
  };
}
// TYPES DEFINITION /////

interface FXStore {
  // BUNDLE EDITING /////
  bundleArray: Bundle[];
  getBundle: (bundleID: BundleID) => Bundle;
  addBundle: () => void;
  setBundleSelection: (
    bundleID: BundleID,
    isSelected: BundleIsSelected
  ) => void;
  setBundleName: (bundleID: BundleID, bundleName: BundleName) => void;
  setBundleParams: (
    bundleID: BundleID,
    params: {
      gainValue?: OutputGain["gainValue"];
      dryWetValue?: DryWet["dryWetValue"];
    }
  ) => void;
  // BUNDLE EDITING /////

  // FX EDITING /////
  addFX: (bundleID: BundleID, fxID: FxID, fxName: FxName) => void;
  setFXSelection: (
    bundleID: BundleID,
    fxID: FxID,
    isSelected: FxIsSelected
  ) => void;
  updateFXParams: (
    bundleID: BundleID,
    fxID: FxID,
    FX_Params: T_FX_Node[keyof T_FX_Node]
  ) => void;
  // FX EDITING /////

  // FX /////
  reverb_FX: (bundleID: BundleID, FX_Params: T_FX_Node["reverb"]) => void;
  distortion_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["distortion"]
  ) => void;
  feedbackDelay_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["feedbackDelay"]
  ) => void;
  // FX /////
}
export const useFXStore = create<FXStore>((set, get) => ({
  bundleArray: [],
  getBundle: (bundleID: BundleID) => {
    return get().bundleArray[bundleID];
  },
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

  setBundleSelection: (bundleID: BundleID, isSelected: BundleIsSelected) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];

      if (newBundleArray[bundleID]) {
        newBundleArray[bundleID] = {
          ...newBundleArray[bundleID],
          bundleIsSelected: isSelected,
        };
      }

      return { bundleArray: newBundleArray };
    });
  },

  setBundleName: (bundleID: BundleID, bundleName: BundleName) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];

      if (newBundleArray[bundleID]) {
        newBundleArray[bundleID] = {
          ...newBundleArray[bundleID],
          bundleName: bundleName,
        };
      }

      return { bundleArray: newBundleArray };
    });
  },

  setBundleParams: (
    bundleID: BundleID,
    params: {
      gainValue?: OutputGain["gainValue"];
      dryWetValue?: DryWet["dryWetValue"];
    }
  ) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleParams: BundleParams = {
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
  addFX: (bundleID: BundleID, fxID: FxID, fxName: FxName) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];

      if (bundle.bundleParams.fxs.find((fx) => fx.fxID === fxID))
        return { bundleArray: newBundleArray };

      const newFxObject: Fxs[number] = {
        fxID: fxID,
        fxName: fxName || null,
        fxIsSelected: false,
        fxNode: null,
      };

      bundle.bundleParams.fxs.push(newFxObject);

      newBundleArray[bundleID] = {
        ...bundle,
      };
      return { bundleArray: newBundleArray };
    });
  },
  setFXSelection: (
    bundleID: BundleID,
    fxID: FxID,
    isSelected: FxIsSelected
  ) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];

      const updatedFXs = bundle.bundleParams.fxs.map((fx) => ({
        ...fx,
        fxIsSelected: isSelected ? fx.fxID === fxID : false,
      }));

      bundle.bundleParams = {
        ...bundle.bundleParams,
        fxs: updatedFXs,
      };

      newBundleArray[bundleID] = {
        ...bundle,
      };
      return { bundleArray: newBundleArray };
    });
  },

  updateFXParams(
    bundleID: BundleID,
    fxID: FxID,
    FX_Params: T_FX_Node[keyof T_FX_Node]
  ) {
    switch (fxID) {
      case "REVERB":
        get().reverb_FX(bundleID, FX_Params as T_FX_Node["reverb"]);
        break;
      case "DISTORTION":
        get().distortion_FX(bundleID, FX_Params as T_FX_Node["distortion"]);
        break;
      case "FEEDBACKDELAY":
        get().feedbackDelay_FX(
          bundleID,
          FX_Params as T_FX_Node["feedbackDelay"]
        );
        break;
      default:
        throw new Error(`Unsupported FX ID: ${fxID}`);
    }
  },

  reverb_FX: (bundleID: BundleID, params: T_FX_Node["reverb"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];
      const fx = newBundleFXs.find(
        (fx) => fx.fxID === "REVERB" && fx.fxNode != null
      );
      const newFxParams = { ...params };

      const reverb = new Tone.Reverb(
        fx && fx.fxNode
          ? {
              ...fx.fxNode.get(),
              ...newFxParams,
            }
          : { ...newFxParams }
      );

      newBundleFXs.push(
        fx
          ? { ...fx, fxNode: reverb }
          : ({
              fxID: "REVERB",
              fxName: "Reverb",
              fxIsSelected: false,
              fxNode: reverb,
            } as Fxs[number])
      );

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  distortion_FX: (bundleID: BundleID, params: T_FX_Node["distortion"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];
      const fx = newBundleFXs.find(
        (fx) => fx.fxID === "DISTORTION" && fx.fxNode != null
      );

      const newFxParams = { ...params };

      const distortion = new Tone.Distortion(
        fx && fx.fxNode
          ? {
              ...fx.fxNode.get(),
              ...newFxParams,
            }
          : { ...newFxParams }
      );

      newBundleFXs.push(
        fx
          ? { ...fx, fxNode: distortion }
          : ({
              fxID: "DISTORTION",
              fxName: "Distortion",
              fxIsSelected: false,
              fxNode: distortion,
            } as Fxs[number])
      );

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  feedbackDelay_FX: (
    bundleID: BundleID,
    params: T_FX_Node["feedbackDelay"]
  ) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];
      const fx = newBundleFXs.find(
        (fx) => fx.fxID === "FEEDBACKDELAY" && fx.fxNode != null
      );

      const newFxParams = { ...params };

      const feedbackDelay = new Tone.FeedbackDelay(
        fx && fx.fxNode
          ? {
              ...fx.fxNode.get(),
              ...newFxParams,
            }
          : { ...newFxParams }
      );

      newBundleFXs.push(
        fx
          ? { ...fx, fxNode: feedbackDelay }
          : ({
              fxID: "FEEDBACKDELAY",
              fxName: "FeedbackDelay",
              fxIsSelected: false,
              fxNode: feedbackDelay,
            } as Fxs[number])
      );

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
}));
