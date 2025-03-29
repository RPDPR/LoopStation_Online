import { TuningFX } from "./setUpFxContent/TuningFX.tsx";
import { TuningBundle } from "./setUpFxContent/TuningBundle.tsx";

export const SetUpFxArea: React.FC = () => {
  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] overflow-hidden rounded-2xl h-full flex flex-row col-span-2 pl-2 gap-x-1 pr-1 py-2">
      <TuningFX />
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-1/3">
        <TuningBundle />
      </div>
    </div>
  );
};
