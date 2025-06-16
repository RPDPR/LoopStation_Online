import { FC } from "react";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex, LoopState_Rec } from "@data/store/LoopStoreTypes.ts";
import { Circle, Play } from "lucide-react";

export type T_PlayRecBtn = {
  trackIndex: TrackIndex;
};

export const PlayRecBtn: FC<T_PlayRecBtn> = ({ trackIndex }) => {
  const track = useLoopStore((state) => state.trackArray[trackIndex]);
  const startRecording = useLoopStore((state) => state.startRecording);
  const stopRecording = useLoopStore((state) => state.stopRecording);

  if (!track) {
    console.error(`Invalid track index: ${trackIndex}`, track);
    return null;
  }

  const handleClick = () => {
    switch (track.state_rec) {
      case LoopState_Rec.Idle: // 1 click
        startRecording(trackIndex);
        break;
      case LoopState_Rec.Recording: // 2 click
        stopRecording(trackIndex);
        break;
      case LoopState_Rec.Overdubbing: // 3 click
        stopRecording(trackIndex);
        break;
      case LoopState_Rec.Playing: // 4 click
        startRecording(trackIndex);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-12 h-12 flex justify-center items-center">
      <button
        className="cursor-pointer flex justify-center items-center"
        onClick={handleClick}
      >
        <div className="border-2 border-[#757575] w-[44px] h-[44px] rounded-full flex justify-center items-center">
          {track.state_rec === LoopState_Rec.Idle ||
          track.state_rec === LoopState_Rec.Recording ? (
            <Circle size={20} color="#757575" fill="#757575" />
          ) : track.state_rec === LoopState_Rec.Overdubbing ? (
            <Circle size={20} color="#757575" fill="#757575" />
          ) : (
            <Play size={20} color="#757575" fill="#757575" />
          )}
        </div>
      </button>
    </div>
  );
};
