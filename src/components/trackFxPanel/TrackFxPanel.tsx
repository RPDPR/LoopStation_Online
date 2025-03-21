import React from "react";
import { TrackFxBucket } from "./trackFxBucket/TrackFxBucket.tsx";

export const TrackFxPanel: React.FC = () => {
  return (
    <div className="mx-auto w-[95%] h-[93px] flex justify-center items-center mb-[2.5rem]">
      <TrackFxBucket trackIndex={0} />
      <TrackFxBucket trackIndex={1} />
      <TrackFxBucket trackIndex={2} />
      <TrackFxBucket trackIndex={3} />
      <TrackFxBucket trackIndex={4} />
    </div>
  );
};
