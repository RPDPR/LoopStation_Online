import { useFXStore } from "../../../../../data/store/FXStore.ts";
import { useDraggable } from "@dnd-kit/core";

type T_BundleCard = {
  bundleID: number;
};

export const BundleCard: React.FC<T_BundleCard> = ({ bundleID }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `bundle-${bundleID}`,
    data: {
      bundleID: bundleID,
    },
  });

  const bundleArray = useFXStore((state) => state.bundleArray);
  const setBundleSelection = useFXStore((state) => state.setBundleSelection);

  const bundle = bundleArray.find((b) => b.bundleID === bundleID);
  const isSelected = bundle?.bundleIsSelected ?? false;

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    bundleArray.forEach((bundle) => {
      setBundleSelection(bundle.bundleID, bundle.bundleID === bundleID);
    });
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-12 w-12 h-full text-xs text-left flex flex-row items-end py-2 pl-2"
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={
          "w-full h-full rounded-lg cursor-pointer border-2 " +
          (isSelected
            ? "border-[#959595] text-[#959595] hover:border-[#959595] hover:text-[#959595]"
            : "border-[#757575] text-[#757575] hover:border-[#858585] hover:text-[#858585]") +
          " flex flex-row justify-center items-center transition-color duration-150"
        }
      >
        {String(bundleID + 1)}
      </div>
    </div>
  );
};
