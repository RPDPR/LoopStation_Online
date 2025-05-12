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
  OutputGain,
  DryWet,
  T_FX_Node,
} from "@data/store/FXStoreTypes.ts";
import { FX_ID, FX_NAME } from "@data/store/FX_ParamsTypes.ts";
import { FX_PARAMS_DEFAULTS } from "@data/store/FX_ParamsTypes.ts";
import { FXUtils } from "@data/store/audioUtils/main.ts";

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
      fxID: FX_ID;
      fxName: FX_NAME;
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
  reverb_FX: (bundleID: BundleID, FX_Params: T_FX_Node["REVERB"]) => void;
  distortion_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["DISTORTION"]
  ) => void;
  feedbackDelay_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["FEEDBACKDELAY"]
  ) => void;
  bitCrusher_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["BITCRUSHER"]
  ) => void;
  phaser_FX: (bundleID: BundleID, FX_Params: T_FX_Node["PHASER"]) => void;
  frequencyShifter_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["FREQUENCYSHIFTER"]
  ) => void;
  tremolo_FX: (bundleID: BundleID, FX_Params: T_FX_Node["TREMOLO"]) => void;
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
    FX_Params: T_FX_Node[keyof T_FX_Node] = {} as T_FX_Node[keyof T_FX_Node]
  ) {
    switch (fxID) {
      case "REVERB":
        get().reverb_FX(bundleID, FX_Params as T_FX_Node["REVERB"]);
        break;
      case "DISTORTION":
        get().distortion_FX(bundleID, FX_Params as T_FX_Node["DISTORTION"]);
        break;
      case "FEEDBACKDELAY":
        get().feedbackDelay_FX(
          bundleID,
          FX_Params as T_FX_Node["FEEDBACKDELAY"]
        );
        break;
      case "BITCRUSHER":
        get().bitCrusher_FX(bundleID, FX_Params as T_FX_Node["BITCRUSHER"]);
        break;
      case "PHASER":
        get().phaser_FX(bundleID, FX_Params as T_FX_Node["PHASER"]);
        break;
      case "FREQUENCYSHIFTER":
        get().frequencyShifter_FX(
          bundleID,
          FX_Params as T_FX_Node["FREQUENCYSHIFTER"]
        );
        break;
      case "TREMOLO":
        get().tremolo_FX(bundleID, FX_Params as T_FX_Node["TREMOLO"]);
        break;
      default:
        throw new Error(`Unsupported FX ID: ${fxID}`);
    }
  },

  reverb_FX: (bundleID: BundleID, params?: T_FX_Node["REVERB"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "REVERB");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.REVERB
      );

      const reverb: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.Reverb({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.Reverb({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "REVERB",
        fxName: fx?.fxName ?? "Reverb",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: reverb,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  distortion_FX: (bundleID: BundleID, params: T_FX_Node["DISTORTION"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "DISTORTION");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.DISTORTION
      );

      const distortion: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.Distortion({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.Distortion({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "DISTORTION",
        fxName: fx?.fxName ?? "Distortion",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: distortion,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  feedbackDelay_FX: (
    bundleID: BundleID,
    params: T_FX_Node["FEEDBACKDELAY"]
  ) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex(
        (fx) => fx.fxID === "FEEDBACKDELAY"
      );
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.FEEDBACKDELAY
      );

      const feedbackDelay: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.FeedbackDelay({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.FeedbackDelay({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "FEEDBACKDELAY",
        fxName: fx?.fxName ?? "FeedbackDelay",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: feedbackDelay,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
  bitCrusher_FX: (bundleID: BundleID, params: T_FX_Node["BITCRUSHER"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "BITCRUSHER");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.BITCRUSHER
      );

      const bitCrusher: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.BitCrusher({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.BitCrusher({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "BITCRUSHER",
        fxName: fx?.fxName ?? "BitCrusher",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: bitCrusher,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  phaser_FX: (bundleID: BundleID, params: T_FX_Node["PHASER"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "PHASER");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.PHASER
      );

      const phaser: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.Phaser({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.Phaser({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "PHASER",
        fxName: fx?.fxName ?? "Phaser",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: phaser,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  frequencyShifter_FX: (
    bundleID: BundleID,
    params: T_FX_Node["FREQUENCYSHIFTER"]
  ) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex(
        (fx) => fx.fxID === "FREQUENCYSHIFTER"
      );
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.FREQUENCYSHIFTER
      );

      const frequencyShifter: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.FrequencyShifter({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.FrequencyShifter({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "FREQUENCYSHIFTER",
        fxName: fx?.fxName ?? "FrequencyShifter",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: frequencyShifter,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },

  tremolo_FX: (bundleID: BundleID, params: T_FX_Node["TREMOLO"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "TREMOLO");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.TREMOLO
      );

      const tremolo: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.Tremolo({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.Tremolo({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "TREMOLO",
        fxName: fx?.fxName ?? "Tremolo",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: tremolo,
      };

      if (fxIndex !== -1) {
        newBundleFXs[fxIndex] = newFXObject;
      } else {
        newBundleFXs.push(newFXObject);
      }

      newBundleArray[bundleID] = {
        ...bundle,
        bundleParams: { ...bundle.bundleParams, fxs: newBundleFXs },
      };

      return { bundleArray: newBundleArray };
    });
  },
}));
