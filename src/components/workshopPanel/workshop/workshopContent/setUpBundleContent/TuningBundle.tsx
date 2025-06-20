import { FC } from "react";
import { BundleHeader } from "./TuningBundleContent/BundleHeader.tsx";
import { BundleSettings } from "./TuningBundleContent/BundleSettings.tsx";
import { useFXStore } from "@data/store/FXStore.ts";
import { Consts } from "@data/store/Consts.ts";

export const TuningBundle: FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  const selectedBundle =
    bundleArray.find((bdl) => bdl.bundleIsSelected) ?? false;

  return (
    <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-1/2">
      {selectedBundle ? (
        <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden flex flex-col items-center text-center text-xs px-2">
          <BundleHeader selectedBundleID={selectedBundle.bundleID} />
          <BundleSettings selectedBundleID={selectedBundle.bundleID} />
        </div>
      ) : (
        <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden flex flex-col justify-center items-center text-center text-sm px-5">
          {Consts.SetUpBundleArea.TuningBundle.fillerText_1}
        </div>
      )}
    </div>
  );
};
