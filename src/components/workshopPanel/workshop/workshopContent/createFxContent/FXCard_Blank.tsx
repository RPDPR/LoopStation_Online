import React from "react";
import { fxNames } from "@data/store/FXStore.ts";
import { useFXStore } from "@data/store/FXStore.ts";

type T_FXCard_Blank = {
  fxName: fxNames;
};

export const FXCard_Blank: React.FC<T_FXCard_Blank> = ({ fxName }) => {
  const addFX = useFXStore((state) => state.addFX);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray.find((bdl) => bdl.bundleIsSelected);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (bundle) {
      addFX(bundle.bundleID, fxName);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-5.5 text-xs text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] border-b-2 border-b-[#353535] cursor-pointer hover:bg-[#858585] flex flex-row text-nowrap flex-nowrap items-center overflow-hidden px-3 relative z-5"
    >
      <div className="w-full h-full text-white">{fxName}</div>
    </div>
  );
};
