import React from "react";
import { useFXStore } from "../../../../../../../data/store/FXStore.ts";

type T_OutputGain = {
  bundleSelectedID: number;
};

export const OutputGain: React.FC<T_OutputGain> = ({ bundleSelectedID }) => {
  const setBundleParams = useFXStore((state) => state.setBundleParams);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleSelectedID];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBundleParams(bundle.bundleID, { gainValue: Number(e.target.value) });
  };

  return (
    <div className="w-full h-5 flex flex-row items-center gap-x-3 basis-1/3">
      <div className="w-8 flex justify-center items-center">
        <input
          type="range"
          min={bundle.bundleParams.outputGain.min}
          max={bundle.bundleParams.outputGain.max}
          step={bundle.bundleParams.outputGain.step}
          className="w-full h-1 bg-[#757575] rounded-lg appearance-none cursor-pointer 
             [&::-webkit-slider-thumb]:appearance-none 
             [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
             [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
             [&::-webkit-slider-thumb]:cursor-pointer 
             [&::-webkit-slider-thumb]:transition-colors 
             [&::-webkit-slider-thumb]:hover:bg-gray-200 
             [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
             [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full 
             [&::-moz-range-thumb]:cursor-pointer 
             [&::-moz-range-thumb]:transition-colors 
             [&::-moz-range-thumb]:hover:bg-gray-200"
          value={bundle.bundleParams.outputGain.gainValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
