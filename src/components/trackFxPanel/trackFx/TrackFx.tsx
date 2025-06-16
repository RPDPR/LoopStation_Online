import { FC } from "react";
import { TrackFx_BundleCard } from "./trackFxContent/TrackFx_BundleCard.tsx";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";
import { useDroppable } from "@dnd-kit/core";

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

  return (
    <div
      ref={droppable.setNodeRef}
      className={`"bg-white/2 mx-auto p-3 w-[14%] h-[100px] rounded-4xl shadow-[0_0_10px_rgb(30,30,30)] flex items-center justify-center gap-x-4
    ${droppable.isOver ? "bg-white/2" : ""}`}
    >
      {containerFxBundles.map((bundle) => (
        <TrackFx_BundleCard
          key={bundle.bundleID}
          trackIndex={trackIndex}
          bundleID={bundle.bundleID}
        />
      ))}
    </div>
  );
};
