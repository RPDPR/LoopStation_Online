import { FC } from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { BundleID, FxID } from "@data/store/FXStoreTypes.ts";
import { FX_PARAMS_DEFAULTS, FX_ID } from "@data/store/FX_ParamsTypes.ts";
import { T_FX_Node } from "@data/store/FXStoreTypes.ts";

type T_TuningFX_Params = {
  bundleID: BundleID;
  fxID: FxID;
};

export const TuningFX_Params: FC<T_TuningFX_Params> = ({ bundleID, fxID }) => {
  const updateFX = useFXStore((state) => state.updateFXParams);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleID];
  const fx = bundle.bundleParams.fxs.find((fx) => fx.fxID === fxID);
  const fxParams = fx?.fxNode?.get() ?? null;

  const fxEditableParams = Object.entries(fxParams as T_FX_Node[FX_ID]).filter(
    ([paramKey]) => {
      return Object.keys(FX_PARAMS_DEFAULTS[fxID]).includes(paramKey);
    }
  );

  return (
    <div className="w-full h-full grid grid-cols-2 auto-rows-max gap-2 overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1">
      {fx && fxParams ? (
        fxEditableParams.map(([paramKey, paramValue]) => {
          return (
            <div key={`fxParam-${bundle.bundleID}-${fx.fxID}-${paramKey}`}>
              {`${paramKey} ${paramValue}`}
            </div>
          );
        })
      ) : (
        <div>
          <button>Argh</button>
        </div>
      )}

      {/* <div className="h-10 bg-[#757575] overflow-hidden rounded-lg flex flex-row items-center pl-5">
        <div className="flex space-x-4">
        <div className="text-sm">
        <div className="text-[8px]"></div>
        </div>
        </div>
        </div> */}
    </div>
  );
};

{
  /* <div className="flex space-x-4">
<div className="text-sm">
  <div className="text-[8px]"></div>
</div>
</div> */
}
