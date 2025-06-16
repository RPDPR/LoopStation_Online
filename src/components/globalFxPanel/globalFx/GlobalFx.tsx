import { FC } from "react";
import { InputFxBucket } from "@globalFx/inputFxContent/InputFxBucket.tsx";
import { MasterFxBucket } from "@globalFx/masterFxContent/MasterFxBucket.tsx";
import { BpmAdjuster } from "@globalFx/toolsContent/BpmAdjuster.tsx";
import { Metronome } from "@globalFx/toolsContent/Metronome.tsx";

export const GlobalFx: FC = () => {
  return (
    <div className="mx-auto w-full h-full rounded-4xl px-5 py-4 flex flex-row">
      <div className="flex flex-col items-center basis-1/3">
        <InputFxBucket />
      </div>
      <div className="flex flex-col items-center basis-1/3">
        <MasterFxBucket />
      </div>
      <div className="flex flex-col items-center basis-1/3">
        <BpmAdjuster />
        <Metronome />
      </div>
    </div>
  );
};
