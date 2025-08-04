import { FC } from "react";
import { BundleID } from "@data/store/FXStoreTypes.ts";

type T_BundleSettings = {
  selectedBundleID: BundleID;
};

export const BundleSettings: FC<T_BundleSettings> = ({ selectedBundleID }) => {
  return (
    <div className="w-full h-full flex flex-row justify-between items-center gap-x-3 basis-1/3"></div>
  );
};
