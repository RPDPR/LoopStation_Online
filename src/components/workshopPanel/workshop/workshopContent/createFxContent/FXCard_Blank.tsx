import { FC } from "react";
import { useFXStore } from "@data/store/FXStore.ts";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { FxID, FxName } from "@data/store/FXStoreTypes.ts";
import { trackIndexArray } from "@data/store/LoopStoreTypes.ts";
import { FX_PARAMS_TEMPLATES } from "@data/store/FX_ParamsObjects";

type T_FXCard_Blank = {
  fxID: FxID;
  fxName?: FxName;
};

export const FXCard_Blank: FC<T_FXCard_Blank> = ({
  fxID: fxID,
  fxName: fxName,
}) => {
  const addFX = useFXStore((state) => state.addFX);
  const updateFXParams = useFXStore((state) => state.updateFXParams);
  const updateTrackFXs = useLoopStore((state) => state.updateTrackFXs);

  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray.find((bdl) => bdl.bundleIsSelected);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (bundle) {
      addFX(bundle.bundleID, fxID, fxName ?? FX_PARAMS_TEMPLATES[fxID].name);
      updateFXParams(bundle.bundleID, fxID, {});

      trackIndexArray.forEach((trackIndex) => {
        updateTrackFXs(trackIndex);
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-5.5 text-xs text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] border-b-2 border-b-[#353535] cursor-pointer hover:bg-[#858585] flex flex-row text-nowrap flex-nowrap items-center overflow-hidden pl-3 relative z-5"
    >
      <div className="w-full h-full text-white overflow-hidden whitespace-nowrap text-ellipsis pr-3">
        {fxName || "fxName"}
      </div>
    </div>
  );
};
