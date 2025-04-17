import { useFXStore } from "@data/store/FXStore.ts";

type T_FXCard = {
  bundleID: number;
  fxID: number;
};

export const FXCard: React.FC<T_FXCard> = ({ bundleID, fxID }) => {
  const setFXSelection = useFXStore((state) => state.setFXSelection);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleID];
  const fx = bundle.bundleParams.fxs[fxID];
  const isSelected = fx.fxIsSelected;

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    bundle.bundleParams.fxs.forEach((fx) => {
      setFXSelection(bundle.bundleID, fx.fxID, fx.fxID === fxID);
    });
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
      <div className="text-white">{fx.fxName}</div>
    </div>
  );
};
