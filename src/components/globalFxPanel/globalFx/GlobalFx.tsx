import { InputFxBucket } from "./inputFxContent/InputFxBucket.tsx";
import { MasterFxBucket } from "./masterFxContent/masterFxBucket.tsx";
import { BpmAdjuster } from "./toolsContent/BpmAdjuster.tsx";
import { Metronome } from "./toolsContent/Metronome.tsx";

export const GlobalFx: React.FC = () => {
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
