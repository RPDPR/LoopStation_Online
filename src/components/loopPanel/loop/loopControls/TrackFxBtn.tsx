import { FC, useState } from "react";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";

export type T_TrackFxBtn = {
  trackIndex: TrackIndex;
};

export const TrackFxBtn: FC<T_TrackFxBtn> = ({ trackIndex }) => {
  const toggleTrackFX = useLoopStore((state) => state.toggleTrackFX);
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleClick = () => {
    toggleTrackFX(trackIndex);
    setIsActive(!isActive);
  };

  return (
    <div className="w-25 mt-1 ml-1 mb-2 flex justify-between">
      <button
        className={
          isActive
            ? "bg-green-700/70 px-2 py-1 rounded-md cursor-pointer flex transition-colors duration-150"
            : "bg-white/10 px-2 py-1 rounded-md cursor-pointer flex transition-colors duration-150"
        }
        onClick={handleClick}
      >
        TRACK
      </button>
    </div>
  );
};
