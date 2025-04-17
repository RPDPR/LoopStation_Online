import { TuningFX_Param } from "./TuningFXContent/TuningFX_Param.tsx";
import { useFXStore } from "@data/store/FXStore.ts";

export const TuningFX: React.FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  const fillerText_1 = "There is no FX here";
  const selectedBundle =
    bundleArray.find((bdl) => bdl.bundleIsSelected) ?? false;

  return (
    <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] basis-2/3">
      {selectedBundle ? (
        <div className="w-full h-full grid grid-cols-2 auto-rows-max gap-2 overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1">
          <TuningFX_Param
            bundleID={selectedBundle.bundleID}
            FX_Params={{ "Bundle Name:": selectedBundle.bundleName }}
          />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden flex flex-row justify-center items-center text-center text-sm px-3">
          {fillerText_1}
        </div>
      )}
    </div>
  );
};
