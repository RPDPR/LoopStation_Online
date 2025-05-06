import { ChangeEvent, FC } from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { BundleID, FxID, T_FX_Node } from "@data/store/FXStoreTypes.ts";
import { FXUtils } from "@data/store/audioUtils/main.ts";
import { FX_ID } from "@data/store/FX_ParamsTypes.ts";

type T_TuningFX_Params = {
  bundleID: BundleID;
  fxID: FxID;
};

export const TuningFX_Params: FC<T_TuningFX_Params> = ({ bundleID, fxID }) => {
  const updateFX = useFXStore((state) => state.updateFXParams);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleID];
  const fx = useFXStore((state) =>
    state.bundleArray[bundleID]?.bundleParams.fxs.find((fx) => fx.fxID === fxID)
  );
  const fxParams = fx?.fxNode?.get();

  const completeFxObject = FXUtils.buildFxObject(
    fxID,
    fxParams as unknown as T_FX_Node[FX_ID] & { [key: string]: unknown }
  );

  const handleChangeNumber =
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      updateFX(bundleID, fxID, { [key]: newValue });
    };

  const handleChangeSelect =
    (key: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const newValue = String(e.target.value);
      updateFX(bundleID, fxID, { [key]: newValue });
    };

  return (
    <div className="w-full h-full grid grid-cols-2 auto-rows-max gap-x-4 gap-y-2 overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1">
      {fx && fxParams ? (
        Object.entries(completeFxObject)
          .filter(([key]) => {
            return key !== "id" && key !== "name";
          })
          .map(([key, param]) => {
            return (
              <div
                className="flex flex-row justify-between items-center"
                key={`fxParam-${bundle.bundleID}-${fx.fxID}-${key}`}
              >
                <div className="text-xs">{param.name}</div>
                <div className="">
                  {param.type === "number" ? (
                    <input
                      onChange={handleChangeNumber(key)}
                      className="w-14 h-1 bg-[#757575] rounded-lg appearance-none cursor-pointer 
             [&::-webkit-slider-thumb]:appearance-none 
             [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
             [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
             [&::-webkit-slider-thumb]:cursor-pointer 
             [&::-webkit-slider-thumb]:transition-colors 
             [&::-webkit-slider-thumb]:hover:bg-gray-200 
             [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
             [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full 
             [&::-moz-range-thumb]:cursor-pointer 
             [&::-moz-range-thumb]:transition-colors 
             [&::-moz-range-thumb]:hover:bg-gray-200"
                      type="range"
                      max={param.max}
                      min={param.min}
                      step={param.step}
                      value={param.value}
                    />
                  ) : (
                    <select
                      onChange={handleChangeSelect(key)}
                      value={param.value}
                      className="bg-[#757575] border border-[#757575] text-white text-sm rounded-lg focus:border-white block p-1 appearance-none text-center"
                    >
                      {param.options.map((option: string) => (
                        <option
                          key={`paramSelectOption-${fx.fxID}-${key}-${option}`}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
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
