import { FX_ParamsTypes, FX_ID, FX_NAME } from "@data/store/FX_ParamsTypes.ts";
import { ToneAudioNode } from "tone";

// TYPES DEFINITION /////
export type BOG_GainValue = number;
export type BOG_GainNode = ToneAudioNode;
export type BOG_Min = number;
export type BOG_Max = number;
export type BOG_Step = number;

export type BDW_DryWetValue = number;
export type BDW_DryWetNode = ToneAudioNode;
export type BDW_Min = number;
export type BDW_Max = number;
export type BDW_Step = number;

export type BundleOutputGain = {
  gainValue: BOG_GainValue;
  gainNode: BOG_GainNode;
  min: BOG_Min;
  max: BOG_Max;
  step?: BOG_Step;
};
export type BundleDryWet = {
  dryWetValue: BDW_DryWetValue;
  dryWetNode: BDW_DryWetNode;
  min: BDW_Min;
  max: BDW_Max;
  step?: BDW_Step;
};

// Bundle types /////
export type BundleID = number;
export type BundleName = string;
export type BundleIsSelected = boolean;

export type FxID = FX_ID;
export type FxName = FX_NAME;
export type FxIsSelected = boolean;
export type FxNode = ToneAudioNode | null;

export type Fxs = {
  fxID: FxID;
  fxName: FxName;
  fxIsSelected: FxIsSelected;
  fxNode: FxNode;
}[];
export type BundleParams = {
  fxs: Fxs;
  outputGain: BundleOutputGain;
  dryWet: BundleDryWet;
};

export interface Bundle {
  bundleID: BundleID;
  bundleName: BundleName;
  bundleIsSelected: BundleIsSelected;
  bundleParams: BundleParams;
}

// FX Node Params Types /////
type ExtractFXParamValues<T> = {
  [K in keyof T]: T[K] extends { value: infer V } ? V : never;
};

type FX_Node_ParamsTypes = {
  [K in keyof FX_ParamsTypes]: Partial<
    ExtractFXParamValues<Omit<FX_ParamsTypes[K], "id" | "name">>
  >;
};

export type T_FX_Node = {
  AUTOPANNER: FX_Node_ParamsTypes["AUTOPANNER"];
  REVERB: FX_Node_ParamsTypes["REVERB"];
  DISTORTION: FX_Node_ParamsTypes["DISTORTION"];
  CHEBYSHEV: FX_Node_ParamsTypes["CHEBYSHEV"];
  FEEDBACKDELAY: FX_Node_ParamsTypes["FEEDBACKDELAY"];
  PITCHSHIFT: FX_Node_ParamsTypes["PITCHSHIFT"];
  BITCRUSHER: FX_Node_ParamsTypes["BITCRUSHER"];
  PHASER: FX_Node_ParamsTypes["PHASER"];
  FREQUENCYSHIFTER: FX_Node_ParamsTypes["FREQUENCYSHIFTER"];
  TREMOLO: FX_Node_ParamsTypes["TREMOLO"];
  EQ3: FX_Node_ParamsTypes["EQ3"];
  COMPRESSOR: FX_Node_ParamsTypes["COMPRESSOR"];
};

export type T_FX_Node_Elem = T_FX_Node[keyof T_FX_Node];

// FXStore /////
export interface FXStore {
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
      gainValue?: BOG_GainValue;
      dryWetValue?: BDW_DryWetValue;
    }
  ) => void;
  // BUNDLE EDITING /////

  // FX EDITING /////
  addFX: (bundleID: BundleID, fxID: FxID, fxName: FxName) => void;
  deleteFX: (bundleID: BundleID, fxID: FxID) => void;
  setFXSelection: (
    bundleID: BundleID,
    fxID: FxID,
    isSelected: FxIsSelected
  ) => void;
  updateFXParams: (
    bundleID: BundleID,
    fxID: FxID,
    FX_Params: T_FX_Node_Elem
  ) => void;
  // FX EDITING /////

  // FX /////
  autoPanner_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["AUTOPANNER"]
  ) => void;
  reverb_FX: (bundleID: BundleID, FX_Params: T_FX_Node["REVERB"]) => void;
  distortion_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["DISTORTION"]
  ) => void;
  chebyshev_FX: (bundleID: BundleID, FX_Params: T_FX_Node["CHEBYSHEV"]) => void;
  feedbackDelay_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["FEEDBACKDELAY"]
  ) => void;
  pitchShift_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["PITCHSHIFT"]
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
  EQ3_FX: (bundleID: BundleID, FX_Params: T_FX_Node["EQ3"]) => void;
  compressor_FX: (
    bundleID: BundleID,
    FX_Params: T_FX_Node["COMPRESSOR"]
  ) => void;
  // FX /////
}
