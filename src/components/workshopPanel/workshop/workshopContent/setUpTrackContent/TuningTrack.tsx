import { FC } from "react";
import { TrackHeader } from "./TuningTrackContent/TrackHeader.tsx";
import { TrackSettings } from "./TuningTrackContent/TrackSettings.tsx";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";
import { Consts } from "@data/store/Consts.ts";

export const TuningTrack: FC = () => {
  const trackArray = useLoopStore((state) => state.trackArray);

  const selectedTrackIndex = trackArray.findIndex(
    (track) => track.trackIsSelected
  ) as TrackIndex;

  return (
    <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-1/2">
      {selectedTrackIndex > -1 ? (
        <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden flex flex-col items-center text-center text-xs px-2">
          <TrackHeader selectedTrackIndex={selectedTrackIndex} />
          <TrackSettings selectedTrackIndex={selectedTrackIndex} />
        </div>
      ) : (
        <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden flex flex-col justify-center items-center text-center text-sm px-5">
          {Consts.SetUpTrackArea.TuningTrack.fillerText_1}
        </div>
      )}
    </div>
  );
};
