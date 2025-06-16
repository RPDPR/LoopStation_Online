import { FC } from "react";
import { FX_PACK, FX_PACK_IDs } from "@data/store/FX_ParamsTypes.ts";
import { useFXStore } from "@data/store/FXStore.ts";
import { FXCard_Blank } from "@workshop/workshopContent/createFxContent/FXCard_Blank.tsx";
import { FXCard } from "@workshop/workshopContent/createFxContent/FXCard.tsx";
import { Consts } from "@data/store/Consts.ts";

export const CreateFxArea: FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  const selectedBundle =
    bundleArray.find((bdl) => bdl.bundleIsSelected) ?? false;

  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] rounded-2xl h-full overflow-hidden flex flex-row col-span-1 pl-2 gap-x-2 pr-2 py-2">
      <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1 basis-1/2 relative z-10">
        {Object.values(FX_PACK)
          .sort((a, b) => FX_PACK_IDs.indexOf(a.id) - FX_PACK_IDs.indexOf(b.id))
          .map((fx) => (
            <FXCard_Blank
              key={`blank-${fx.id}`}
              fxID={fx.id}
              fxName={fx.name}
            />
          ))}
      </div>
      <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1 basis-1/2 relative z-10">
        {selectedBundle ? (
          selectedBundle.bundleParams.fxs.length ? (
            selectedBundle.bundleParams.fxs
              .sort(
                (a, b) =>
                  FX_PACK_IDs.indexOf(a.fxID) - FX_PACK_IDs.indexOf(b.fxID)
              )
              .map((fx) => (
                <FXCard
                  key={`bundle-${selectedBundle.bundleID}-${fx.fxID}`}
                  bundleID={selectedBundle.bundleID}
                  fxID={fx.fxID}
                  fxName={fx.fxName}
                />
              ))
          ) : (
            <div className="w-full h-full overflow-hidden flex flex-row justify-center items-center text-center text-sm px-3">
              {Consts.CreateFxArea.fillerText_1}
            </div>
          )
        ) : (
          <div className="w-full h-full overflow-hidden flex flex-row justify-center items-center text-center text-sm px-5">
            {Consts.CreateFxArea.fillerText_2}
          </div>
        )}
      </div>
    </div>
  );
};
