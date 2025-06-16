import { FC } from "react";
import { Loop } from "@loop/Loop.tsx";
import { trackIndexArray } from "@data/store/LoopStoreTypes.ts";

export const LoopPanel: FC = () => {
  return (
    <div className="bg-white/2 mx-auto w-[95%] h-70 rounded-4xl shadow-[0_0_30px_rgb(30,30,30)] flex justify-center items-center">
      {trackIndexArray.map((trackIndex) => {
        return <Loop key={`Loop-${trackIndex}`} trackIndex={trackIndex} />;
      })}
    </div>
  );
};
