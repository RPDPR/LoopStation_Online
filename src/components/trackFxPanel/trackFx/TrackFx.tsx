import { FC, MouseEventHandler } from "react";
import { TrackFx_BundleCard } from "./trackFxContent/TrackFx_BundleCard.tsx";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";
import { useDroppable } from "@dnd-kit/core";

type T_TrackFxSelectionBtn = {
  // isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
};

export const TrackFxSelectionBtn: FC<T_TrackFxSelectionBtn> = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="absolute top-2 right-3 cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 141 141"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.35467 15.9514C17.3916 4.99712 39.9418 -1.45456 65.6008 0.790312C83.6277 2.36748 99.3964 7.90788 109.61 15.3479C112.521 17.2681 115.54 19.724 118.442 22.6253C121.383 25.5662 123.866 28.6286 125.797 31.5764C133.183 41.7936 138.679 57.4973 140.248 75.4378C142.372 99.7098 136.712 121.198 126.821 131.1C118.287 142.135 100.833 145.207 89.2023 133.577L48.4357 92.8108L7.6701 52.0442C-3.30401 41.0701 -1.18942 24.9103 8.35467 15.9514Z"
          fill="rgba(255,255,255,0.2)"
        />
      </svg>
    </div>
  );
};

type T_TrackFx = {
  trackIndex: TrackIndex;
};

export const TrackFx: FC<T_TrackFx> = ({ trackIndex }) => {
  const containerFxBundles = useLoopStore(
    (state) => state.trackFX[trackIndex].containerFxBundles
  );

  const droppable = useDroppable({
    id: `track-${trackIndex}`,
    data: {
      bundleContainerType: "trackFX",
      trackIndex: trackIndex,
    },
  });

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    console.log("gg on today) go sleep");
  };
  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    console.log("HAHAHA NIKITA");
  };
  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    console.log("NO NIKITA'S???");
  };

  return (
    <div
      ref={droppable.setNodeRef}
      className={`relative mx-auto p-3 w-[14%] h-[100px] rounded-4xl shadow-[0_0_10px_rgb(30,30,30)] flex items-center justify-center gap-x-4 transition-colors duration-200 ${
        droppable.isOver ? "bg-white/4" : "bg-white/2"
      }`}
    >
      {containerFxBundles.map((bundle) => (
        <TrackFx_BundleCard
          key={bundle.bundleID}
          trackIndex={trackIndex}
          bundleID={bundle.bundleID}
        />
      ))}
      <TrackFxSelectionBtn
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};
