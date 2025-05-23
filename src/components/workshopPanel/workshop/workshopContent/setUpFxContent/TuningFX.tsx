import { FC } from "react";
import { TuningFX_Params } from "./TuningFXContent/TuningFX_Params.tsx";
import { useFXStore } from "@data/store/FXStore.ts";

export const TuningFX: FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  const fillerText_1 = "There is no FX here";
  const fillerText_2 = "No FX selected";
  const selectedBundle = bundleArray.find((bdl) => bdl.bundleIsSelected);
  const fx = selectedBundle?.bundleParams.fxs.find((fx) => fx.fxIsSelected);

  return (
    <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] basis-2/3">
      {!selectedBundle ? (
        <div className="w-full h-full overflow-hidden flex justify-center items-center text-center text-sm px-3">
          {fillerText_1}
        </div>
      ) : !fx ? (
        <div className="w-full h-full overflow-hidden flex justify-center items-center text-center text-sm px-3">
          {fillerText_2}
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TuningFX_Params bundleID={selectedBundle.bundleID} fxID={fx.fxID} />
        </div>
      )}
    </div>
  );
};
