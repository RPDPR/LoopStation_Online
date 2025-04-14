import { fxNames } from "../../../../data/store/FXStore.ts";
import { FXCard } from "./createFxContent/FXCard.tsx";
import { useFXStore } from "../../../../data/store/FXStore.ts";

export const CreateFxArea: React.FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  const fillerText_1 = "There is no FX here";
  const fillerText_2 = "Select a bundle";
  const selectedBundle =
    bundleArray.find((bdl) => bdl.bundleIsSelected) ?? false;

  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] rounded-2xl h-full overflow-hidden flex flex-row col-span-1 pl-2 gap-x-2 pr-2 py-2">
      <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1 basis-1/2 relative z-10">
        {Object.values(fxNames).map((fxName) => (
          <FXCard key={`all-${fxName}`} fxName={String(fxName)} />
        ))}
      </div>
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-1/2">
        {selectedBundle ? (
          selectedBundle.bundleParams.fxs.length ? (
            selectedBundle.bundleParams.fxs.map((fx) => (
              <FXCard
                key={`bundle-${selectedBundle.bundleID}-${fx.fxName}`}
                fxName={String(fx.fxName)}
              />
            ))
          ) : (
            <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden flex flex-row justify-center items-center text-center text-sm px-5">
              {fillerText_1}
            </div>
          )
        ) : (
          <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-hidden flex flex-row justify-center items-center text-center text-sm px-5">
            {fillerText_2}
          </div>
        )}
      </div>
    </div>
  );
};
