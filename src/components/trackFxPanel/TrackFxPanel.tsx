import { FC } from "react";
import { TrackFx } from "@trackFx/TrackFx.tsx";
import { trackIndexArray } from "@data/store/LoopStoreTypes.ts";

export const TrackFxPanel: FC = () => {
  return (
    <div className="mx-auto w-[95%] h-[93px] flex justify-center items-center mb-[2.5rem]">
      {trackIndexArray.map((trackIndex) => (
        <TrackFx key={`Track-${trackIndex}`} trackIndex={trackIndex} />
      ))}
    </div>
  );
};
