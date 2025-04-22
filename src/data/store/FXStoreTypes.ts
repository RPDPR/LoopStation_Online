import { Bundle } from "@data/store/FXStore";

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
