import { useDroppable } from "@dnd-kit/core";

type T_TrackFx = {
  trackIndex: number;
};

export const TrackFx: React.FC<T_TrackFx> = ({ trackIndex }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `track-${trackIndex}`,
    data: {
      type: "track",
      trackIndex,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`"bg-white/2 mx-auto p-3 w-[14%] h-[100px] rounded-4xl shadow-[0_0_10px_rgb(30,30,30)] flex items-center justify-center
    ${isOver ? "bg-green-500/10" : ""}`}
    >
      <div className="w-15"></div>
      <div className="w-15"></div>
      <div className="w-15"></div>
      <div className="w-15"></div>
      <div className="w-15"></div>
    </div>
  );
};
