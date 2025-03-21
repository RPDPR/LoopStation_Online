import React from "react";
import { Loop } from "./loop/Loop.tsx";

export const LoopPanel: React.FC = () => {
  return (
    <div className="bg-white/2 mx-auto w-[95%] h-70 rounded-4xl shadow-[0_0_30px_rgb(30,30,30)] flex justify-center items-center">
      <Loop trackIndex={0} />
      <Loop trackIndex={1} />
      <Loop trackIndex={2} />
      <Loop trackIndex={3} />
      <Loop trackIndex={4} />
    </div>
  );
};
