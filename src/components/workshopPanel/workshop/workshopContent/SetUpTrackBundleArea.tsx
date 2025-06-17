import { FC } from "react";
import { TuningBundle } from "./setUpTrackBundleContent/TuningBundle.tsx";
import { TuningTrack } from "./setUpTrackBundleContent/TuningTrack.tsx";

export const SetUpTrackBundleArea: FC = () => {
  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] rounded-2xl h-full overflow-hidden flex flex-col col-span-1 pl-2 gap-x-2 pr-2 py-2">
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-1/3">
        <TuningBundle />
      </div>
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-2/3">
        <TuningTrack />
      </div>
    </div>
  );
};
