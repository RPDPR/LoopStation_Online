import { useDraggable } from "@dnd-kit/core";

type T_TrackFx_BundleCard = {
  bundleID: number;
  trackIndex: number;
};

export const TrackFx_BundleCard: React.FC<T_TrackFx_BundleCard> = ({
  bundleID,
  trackIndex,
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `containerFxBundle-${trackIndex}-${bundleID}`,
    data: {
      bundleContainerType: "trackFX",
      trackIndex: trackIndex,
      containerFxBundleID: bundleID,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="w-10 h-10 rounded-lg border-2 border-[#959595] text-[#959595] flex items-center justify-center text-sm cursor-pointer"
    >
      {String(bundleID + 1)}
    </div>
  );
};
