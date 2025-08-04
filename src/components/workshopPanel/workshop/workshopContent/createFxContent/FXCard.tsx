import { FC, useState } from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { BundleID, FxID, FxName } from "@data/store/FXStoreTypes.ts";
import { trackIndexArray } from "@data/store/LoopStoreTypes.ts";
import { Trash2 } from "lucide-react";

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
  const deleteFX = useFXStore((state) => state.deleteFX);
  const setFXSelection = useFXStore((state) => state.setFXSelection);
  const updateTrackFXs = useLoopStore((state) => state.updateTrackFXs);

  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle =
    bundleArray[
      bundleArray.findIndex((bndl) => bndl.bundleID === bundleID) ?? -1
    ];
  const fx = bundle.bundleParams.fxs.find((fx) => fx.fxID === fxID);
  const isSelected = fx?.fxIsSelected;
  const [isReadyToDelete, setIsReadyToDelete] = useState<boolean>(false);

  const handleClickFxCard: React.MouseEventHandler<HTMLDivElement> = () => {
    if (bundle && fx) {
      setFXSelection(bundle.bundleID, fx.fxID, true);
    }
    if (!isReadyToDelete) {
      setIsReadyToDelete(true);
      return;
    }
  };
  const handleClickDeleteFxBtn: React.MouseEventHandler<
    HTMLDivElement
  > = () => {
    if (!isReadyToDelete) return;

    deleteFX(bundle.bundleID, fxID);
    trackIndexArray.forEach((trackIndex) => {
      updateTrackFXs(trackIndex);
    });

    if (isReadyToDelete) setIsReadyToDelete(false);
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!isSelected) return;
    if (!isReadyToDelete) setIsReadyToDelete(true);
  };
  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!isSelected) return;
    if (isReadyToDelete) setIsReadyToDelete(false);
  };

  return (
    <div
      onClick={handleClickFxCard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={
        "w-full h-5.5 text-xs text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] hover:bg-[#858585] " +
        (isSelected
          ? "bg-[#959595] hover:bg-[#959595]"
          : "bg-[#757575] hover:bg-[#858585]") +
        " border-b-2 border-b-[#353535] cursor-pointer flex flex-row text-nowrap flex-nowrap justify-between items-center overflow-hidden pl-3 relative z-5"
      }
    >
      <div className="text-white overflow-hidden whitespace-nowrap text-ellipsis pr-3">
        {fx?.fxName || fxName || "fxName"}
      </div>
      <div
        onClick={handleClickDeleteFxBtn}
        className={
          isReadyToDelete
            ? "p-1 bg-[rgba(255,0,0,0.25)] shadow-[-8px_0_10px_5px_rgba(255,0,0,0.25)]"
            : ""
        }
      >
        <Trash2
          className={isReadyToDelete ? "" : "hidden"}
          size={12}
          color="white"
        />
      </div>
    </div>
  );
};
