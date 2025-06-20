import { FC } from "react";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";

type T_TrackHeader = {
  selectedTrackIndex: TrackIndex;
};

export const TrackHeader: FC<T_TrackHeader> = ({ selectedTrackIndex }) => {
  const userTrackIndex = selectedTrackIndex + 1;

  return (
    <div className="w-full h-5 flex flex-row items-center gap-x-3 basis-1/3">
      <div className="w-full flex flex-row justify-between items-center gap-x-1 basis-1/5">
        <div className="text-xs leading-none">Track:</div>
        <div className="text-xs leading-none text-white/40">
          {String(userTrackIndex)}
        </div>
      </div>
    </div>
  );
};
