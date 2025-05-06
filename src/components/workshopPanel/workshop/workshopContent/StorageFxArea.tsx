import { BundleCard } from "./storageFxContent/BundleCard.tsx";
import { BundleCard_Blank } from "./storageFxContent/BundleCard_Blank.tsx";
import { useFXStore } from "../../../../data/store/FXStore.ts";

export const StorageFxArea: React.FC = () => {
  const bundleArray = useFXStore((state) => state.bundleArray);

  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] rounded-2xl h-full col-span-3 flex flex-row overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg gap-1 px-1">
      <BundleCard_Blank />
      {bundleArray.map((bundle) => {
        return (
          <BundleCard
            key={`bundle-${bundle.bundleID}`}
            bundleID={bundle.bundleID}
          />
        );
      })}
    </div>
  );
};
