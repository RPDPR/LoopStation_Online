import * as Tone from "tone";
import React from "react";
import { useFXStore } from "@data/store/FXStore.ts";

type T_TuningFX_Param = {
  bundleID: number;
  FX_Params: Record<string, unknown>;
};

export const TuningFX_Param: React.FC<T_TuningFX_Param> = ({
  bundleID,
  FX_Params,
}) => {
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleID];

  return (
    <div className="h-10 bg-[#757575] overflow-hidden rounded-lg flex flex-row items-center pl-5">
      <div className="flex space-x-4">
        {Object.entries(FX_Params).map(([paramName, paramValue]) => (
          <div key={paramName} className="text-sm">
            {/* {paramName}: {String(paramValue)}:{" "} */}
            <div className="text-[8px]">
              {bundle?.bundleParams?.fxs.map((fx) =>
                String(fx.fxName).concat(" ")
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
