import { FC } from "react";
import { BundleID } from "@data/store/FXStoreTypes.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";
import { useDraggable } from "@dnd-kit/core";

type T_TrackFx_BundleCard = {
  bundleID: BundleID;
  trackIndex: TrackIndex;
};

export const TrackFx_BundleCard: FC<T_TrackFx_BundleCard> = ({
  bundleID,
  trackIndex,
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `containerFxBundle-${trackIndex}-${bundleID}`,
    data: {
      bundleContainerType: "TRACKFX",
      trackIndex: trackIndex,
      bundleID: bundleID,
    },
  });

  const userBundleID = String(bundleID + 1);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="w-10 h-10 rounded-lg border-2 border-[#959595] text-[#959595] flex items-center justify-center text-sm cursor-pointer"
    >
      {userBundleID}
    </div>
  );
};
