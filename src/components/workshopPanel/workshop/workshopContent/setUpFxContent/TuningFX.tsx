import { FC } from "react";
import { TuningFX_Params } from "./TuningFXContent/TuningFX_Params.tsx";
import { useFXStore } from "@data/store/FXStore.ts";
import { Consts } from "@data/store/Consts.ts";

export const TuningFX: FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  const selectedBundle = bundleArray.find((bdl) => bdl.bundleIsSelected);
  const fx = selectedBundle?.bundleParams.fxs.find((fx) => fx.fxIsSelected);

  return (
    <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] basis-2/3">
      {!selectedBundle ? (
        <div className="w-full h-full overflow-hidden flex justify-center items-center text-center text-sm px-3">
          {Consts.SetUpFxArea.TuningFX.fillerText_1}
        </div>
      ) : !fx ? (
        <div className="w-full h-full overflow-hidden flex justify-center items-center text-center text-sm px-3">
          {Consts.SetUpFxArea.TuningFX.fillerText_2}
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TuningFX_Params bundleID={selectedBundle.bundleID} fxID={fx.fxID} />
        </div>
      )}
    </div>
  );
};
