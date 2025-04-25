import { FC } from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { BundleID, FxID, FxName } from "@data/store/FXStoreTypes.ts";

type T_FXCard = {
  bundleID: BundleID;
  fxID: FxID;
  fxName?: FxName;
};

export const FXCard: FC<T_FXCard> = ({
  bundleID: bundleID,
  fxID: fxID,
  fxName: fxName,
}) => {
  const setFXSelection = useFXStore((state) => state.setFXSelection);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleID];
  const fx = bundle.bundleParams.fxs.find((fx) => fx.fxID === fxID);
  const isSelected = fx?.fxIsSelected;

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (bundle && fx) {
      setFXSelection(bundle.bundleID, fx.fxID, true);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={
        "w-full h-5.5 text-xs text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] hover:bg-[#858585] " +
        (isSelected
          ? "bg-[#959595] hover:bg-[#959595]"
          : "bg-[#757575] hover:bg-[#858585]") +
        " border-b-2 border-b-[#353535] cursor-pointer flex flex-row text-nowrap flex-nowrap items-center overflow-hidden px-3 relative z-5"
      }
    >
      <div className="text-white">{fx?.fxName || fxName || "fxName"}</div>
    </div>
  );
};
