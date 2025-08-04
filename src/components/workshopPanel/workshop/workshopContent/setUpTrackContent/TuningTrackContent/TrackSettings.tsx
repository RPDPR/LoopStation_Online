import { FC } from "react";
import { OutputGain } from "./TrackSettings_Content/OutputGain.tsx";
import { DryWet } from "./TrackSettings_Content/DryWet.tsx";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";

type T_TrackSettings = {
  selectedTrackIndex: TrackIndex;
};

export const TrackSettings: FC<T_TrackSettings> = ({ selectedTrackIndex }) => {
  return (
    <div className="w-full h-full flex flex-row justify-between items-center gap-x-3 basis-1/3">
      <div className="w-full h-5 flex flex-row justify-between items-center basis-1/2">
        <div className="text-xs leading-none">Gain:</div>
        <div>
          <OutputGain selectedTrackIndex={selectedTrackIndex} />
        </div>
      </div>
      <div className="w-full h-5 flex flex-row justify-between items-center basis-1/2">
        <div className="text-xs leading-none">D/W:</div>
        <div>
          <DryWet selectedTrackIndex={selectedTrackIndex} />
        </div>
      </div>
    </div>
  );
};
