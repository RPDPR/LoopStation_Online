import { useDroppable } from "@dnd-kit/core";

type T_TrackFx = {
  trackIndex: number;
};

export const TrackFx: React.FC<T_TrackFx> = ({ trackIndex }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `track-${trackIndex}`,
    data: {
      bundleContainerType: "trackFX",
      trackIndex: trackIndex,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`"bg-white/2 mx-auto p-3 w-[14%] h-[100px] rounded-4xl shadow-[0_0_10px_rgb(30,30,30)] flex items-center justify-center gap-x-4
    ${isOver ? "bg-white/2" : ""}`}
    >
      {droppedBundles.map((id) => (
        <div
          key={id}
          className="w-10 h-10 rounded-lg border-2 border-[#959595] text-[#959595] flex items-center justify-center text-sm"
        >
          {id + 1}
        </div>
      ))}
    </div>
  );
};
