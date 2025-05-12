import { Bundle } from "@data/store/FXStore";

// Container Bundle Aliases /////
export type ContainerFxBundle = {
  bundleID: Bundle["bundleID"];
  bundleParams: Bundle["bundleParams"];
};

export type ContainerFxBundleID = ContainerFxBundle["bundleID"];
export type ContainerFxBundleParams = ContainerFxBundle["bundleParams"];
export type BundleContainerType = ["INPUTFX", "TRACKFX", "MASTERFX"];
export type BundleContainerTypeElem =
  BundleContainerType[keyof BundleContainerType];
export type OperationType = ["ADD", "DELETE"];
export type OperationTypeElem = OperationType[keyof OperationType];
