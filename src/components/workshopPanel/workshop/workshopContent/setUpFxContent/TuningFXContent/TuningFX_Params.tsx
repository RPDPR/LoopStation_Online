import React from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { BundleID, FxID } from "@data/store/FXStoreTypes.ts";

type T_TuningFX_Params = {
  bundleID: BundleID;
  fxID: FxID;
};

export const TuningFX_Params: React.FC<T_TuningFX_Params> = ({
  bundleID,
  fxID,
}) => {
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleID];
  const fx = bundle.bundleParams.fxs.find((fx) => fx.fxID === fxID);
  const updateFX = useFXStore((state) => state.updateFXParams);

  //Here will be a mapping based on the effect parameters and rendering of each one. Everything is here.

  return (
    <div className="h-10 bg-[#757575] overflow-hidden rounded-lg flex flex-row items-center pl-5">
      <div className="flex space-x-4">
        <div className="text-sm">
          <div className="text-[8px]"></div>
        </div>
      </div>
    </div>
  );
};
