import React from "react";
import { TrackFx } from "@trackFx/TrackFx.tsx";

export const TrackFxPanel: React.FC = () => {
  return (
    <div className="mx-auto w-[95%] h-[93px] flex justify-center items-center mb-[2.5rem]">
      {[0, 1, 2, 3, 4].map((i) => (
        <TrackFx key={i} trackIndex={i} />
      ))}
    </div>
  );
};
