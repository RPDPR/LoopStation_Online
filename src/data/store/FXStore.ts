import { create } from "zustand";
import * as Tone from "tone";
import { FXUtils } from "@data/store/audioUtils/main.ts";
import {
  BundleID,
  BundleName,
  BundleIsSelected,
  // BundleParams,
  Bundle,
  Fxs,
  FxID,
  FxName,
  FxIsSelected,
  T_FX_Node,
  T_FX_Node_Elem,
  FXStore,
} from "@data/store/FXStoreTypes.ts";
import { FX_PARAMS_DEFAULTS } from "@data/store/FX_ParamsTypes.ts";

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
  deleteFX: (bundleID: BundleID, fxID: FxID) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];

      const fxIndex = bundle.bundleParams.fxs.findIndex(
        (fx) => fx.fxID === fxID
      );

      if (fxIndex < 0) return { bundleArray: newBundleArray };

      bundle.bundleParams.fxs.splice(fxIndex, 1);

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
    FX_Params: T_FX_Node_Elem = {} as T_FX_Node_Elem
  ) {
    switch (fxID) {
      case "AUTOPANNER":
        get().autoPanner_FX(bundleID, FX_Params as T_FX_Node["AUTOPANNER"]);
        break;
      case "REVERB":
        get().reverb_FX(bundleID, FX_Params as T_FX_Node["REVERB"]);
        break;
      case "DISTORTION":
        get().distortion_FX(bundleID, FX_Params as T_FX_Node["DISTORTION"]);
        break;
      case "CHEBYSHEV":
        get().chebyshev_FX(bundleID, FX_Params as T_FX_Node["CHEBYSHEV"]);
        break;
      case "FEEDBACKDELAY":
        get().feedbackDelay_FX(
          bundleID,
          FX_Params as T_FX_Node["FEEDBACKDELAY"]
        );
        break;
      case "PITCHSHIFT":
        get().pitchShift_FX(bundleID, FX_Params as T_FX_Node["PITCHSHIFT"]);
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
      case "EQ3":
        get().EQ3_FX(bundleID, FX_Params as T_FX_Node["EQ3"]);
        break;
      case "COMPRESSOR":
        get().compressor_FX(bundleID, FX_Params as T_FX_Node["COMPRESSOR"]);
        break;
      default:
        throw new Error(`Unsupported FX ID: ${fxID}`);
    }
  },

  // autoPanner_FX: (bundleID: BundleID, params?: T_FX_Node["AUTOPANNER"]) => {
  //   set((state) => {
  //     const bundles = [...state.bundleArray];
  //     const bundle = bundles[bundleID];
  //     const fxs = [...bundle.bundleParams.fxs];
  //     const idx = fxs.findIndex((fx) => fx.fxID === "AUTOPANNER");

  //     let apNode = fxs[idx]?.fxNode as Tone.AutoPanner | null;

  //     if (apNode) {
  //       if (params?.frequency != null)
  //         apNode.frequency.value = params.frequency;
  //       if (params?.depth != null) apNode.depth.value = params.depth;
  //       if (params?.type != null) apNode.type = params.type;
  //       if (params?.wet != null) apNode.wet.value = params.wet;
  //     } else {
  //       apNode = new Tone.AutoPanner({
  //         frequency:
  //           params?.frequency ?? FX_PARAMS_DEFAULTS.AUTOPANNER.frequency.value,
  //         depth: params?.depth ?? FX_PARAMS_DEFAULTS.AUTOPANNER.depth.value,
  //         type: params?.type ?? FX_PARAMS_DEFAULTS.AUTOPANNER.type.value,
  //         wet: params?.wet ?? FX_PARAMS_DEFAULTS.AUTOPANNER.wet.value,
  //       })
  //         .toDestination()
  //         .start();
  //     }

  //     const newFX: Fxs[number] = {
  //       fxID: "AUTOPANNER",
  //       fxName: "AutoPanner",
  //       fxIsSelected: fxs[idx]?.fxIsSelected ?? false,
  //       fxNode: apNode,
  //     };

  //     if (idx !== -1) fxs[idx] = newFX;
  //     else fxs.push(newFX);

  //     bundles[bundleID] = {
  //       ...bundle,
  //       bundleParams: {
  //         ...bundle.bundleParams,
  //         fxs,
  //       },
  //     };

  //     return { bundleArray: bundles };
  //   });
  // },

  autoPanner_FX: (bundleID: BundleID, params?: T_FX_Node["AUTOPANNER"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "AUTOPANNER");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.AUTOPANNER
      );

      const autoPanner: Tone.ToneAudioNode =
        fx.fxNode != null
          ? (fx.fxNode as Tone.AutoPanner).set({
              ...mainParams,
              ...sideParams,
              ...Object.fromEntries(
                Object.entries(fx.fxNode.get()).filter(
                  ([key]) =>
                    (key in mainParams || key in sideParams) &&
                    !(params && key in params)
                )
              ),
              ...params,
            })
          : new Tone.AutoPanner({
              ...mainParams,
              ...sideParams,
              ...params,
            }).start();

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "AUTOPANNER",
        fxName: fx?.fxName ?? "AutoPanner",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: autoPanner,
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

  chebyshev_FX: (bundleID: BundleID, params: T_FX_Node["CHEBYSHEV"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "CHEBYSHEV");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.CHEBYSHEV
      );

      const chebyshev: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.Chebyshev({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.Chebyshev({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "CHEBYSHEV",
        fxName: fx?.fxName ?? "Chebyshev",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: chebyshev,
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

  pitchShift_FX: (bundleID: BundleID, params: T_FX_Node["PITCHSHIFT"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "PITCHSHIFT");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.PITCHSHIFT
      );

      const pitchShift: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.PitchShift({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.PitchShift({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "PITCHSHIFT",
        fxName: fx?.fxName ?? "PitchShift",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: pitchShift,
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

  tremolo_FX: (bundleID: BundleID, params?: T_FX_Node["TREMOLO"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "TREMOLO");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.TREMOLO
      );

      const tremolo: Tone.ToneAudioNode =
        fx.fxNode != null
          ? (fx.fxNode as Tone.Tremolo).set({
              ...mainParams,
              ...sideParams,
              ...Object.fromEntries(
                Object.entries(fx.fxNode.get()).filter(
                  ([key]) =>
                    (key in mainParams || key in sideParams) &&
                    !(params && key in params)
                )
              ),
              ...params,
            })
          : new Tone.Tremolo({
              ...mainParams,
              ...sideParams,
              ...params,
            }).start();

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

  EQ3_FX: (bundleID: BundleID, params: T_FX_Node["EQ3"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "EQ3");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.EQ3
      );

      const EQ3: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.EQ3({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.EQ3({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "EQ3",
        fxName: fx?.fxName ?? "EQ3",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: EQ3,
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

  compressor_FX: (bundleID: BundleID, params: T_FX_Node["COMPRESSOR"]) => {
    set((state) => {
      const newBundleArray = [...state.bundleArray];
      const bundle = newBundleArray[bundleID];
      const newBundleFXs: Fxs = [...bundle.bundleParams.fxs];

      const fxIndex = newBundleFXs.findIndex((fx) => fx.fxID === "COMPRESSOR");
      const fx = newBundleFXs[fxIndex];

      const { mainParams, sideParams } = FXUtils.splitFXParams(
        FX_PARAMS_DEFAULTS.COMPRESSOR
      );

      const compressor: Tone.ToneAudioNode =
        fx.fxNode != null
          ? Object.keys(mainParams).length === 0
            ? fx.fxNode.set({
                ...sideParams,
                ...fx.fxNode?.get(),
                ...params,
              })
            : new Tone.Compressor({
                ...mainParams,
                ...fx.fxNode?.get(),
                ...params,
              }).set({ ...sideParams, ...fx.fxNode?.get(), ...params })
          : new Tone.Compressor({
              ...mainParams,
              ...params,
            }).set({
              ...sideParams,
              ...params,
            });

      const newFXObject: Fxs[number] = {
        fxID: fx?.fxID ?? "COMPRESSOR",
        fxName: fx?.fxName ?? "Compressor",
        fxIsSelected: fx?.fxIsSelected ?? false,
        fxNode: compressor,
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
