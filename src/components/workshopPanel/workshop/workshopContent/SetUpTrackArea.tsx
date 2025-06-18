import { FC } from "react";
import { TuningTrack } from "./setUpTrackContent/TuningTrack.tsx";

export const SetUpTrackArea: FC = () => {
  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] rounded-2xl h-full overflow-hidden pl-2 py-2">
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1">
        <TuningTrack />
      </div>
    </div>
  );
};
