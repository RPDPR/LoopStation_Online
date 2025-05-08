import React from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { FxID, FxName } from "@data/store/FXStoreTypes.ts";
import { FX_PARAMS_TEMPLATES } from "@data/store/FX_ParamsObjects";

type T_FXCard_Blank = {
  fxID: FxID;
  fxName?: FxName;
};

export const FXCard_Blank: React.FC<T_FXCard_Blank> = ({
  fxID: fxID,
  fxName: fxName,
}) => {
  const addFX = useFXStore((state) => state.addFX);
  const updateFXParams = useFXStore((state) => state.updateFXParams);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray.find((bdl) => bdl.bundleIsSelected);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (bundle) {
      addFX(bundle.bundleID, fxID, fxName ?? FX_PARAMS_TEMPLATES[fxID].name);
      updateFXParams(bundle.bundleID, fxID, {});
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-5.5 text-xs text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] border-b-2 border-b-[#353535] cursor-pointer hover:bg-[#858585] flex flex-row text-nowrap flex-nowrap items-center overflow-hidden px-3 relative z-5"
    >
      <div className="w-full h-full text-white">{fxName || "fxName"}</div>
    </div>
  );
};
