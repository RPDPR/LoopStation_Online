import { FX_ParamsTypes } from "@data/store/FX_ParamsTypes.ts";
import { Bundle } from "@data/store/FXStore";

// Bundle Aliases /////
export type BundleID = Bundle["bundleID"];
export type BundleName = Bundle["bundleName"];
export type BundleIsSelected = Bundle["bundleIsSelected"];
export type BundleParams = Bundle["bundleParams"];
export type Fxs = Bundle["bundleParams"]["fxs"];
export type FxID = Bundle["bundleParams"]["fxs"][number]["fxID"];
export type FxName = Bundle["bundleParams"]["fxs"][number]["fxName"];
export type FxIsSelected =
  Bundle["bundleParams"]["fxs"][number]["fxIsSelected"];
export type FxNode = Bundle["bundleParams"]["fxs"][number]["fxNode"];
export type OutputGain = Bundle["bundleParams"]["outputGain"];
export type DryWet = Bundle["bundleParams"]["dryWet"];

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
  reverb: FX_Node_ParamsTypes["reverb"];
  distortion: FX_Node_ParamsTypes["distortion"];
  feedbackDelay: FX_Node_ParamsTypes["feedbackDelay"];
};
