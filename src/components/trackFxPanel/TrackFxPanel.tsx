import React from "react";
import { TrackFx } from "@trackFx/TrackFx.tsx";

export const TrackFxPanel: React.FC = () => {
  return (
    <div className="mx-auto w-[95%] h-[93px] flex justify-center items-center mb-[2.5rem]">
      <TrackFx trackIndex={0} />
      <TrackFx trackIndex={1} />
      <TrackFx trackIndex={2} />
      <TrackFx trackIndex={3} />
      <TrackFx trackIndex={4} />
    </div>
  );
};
