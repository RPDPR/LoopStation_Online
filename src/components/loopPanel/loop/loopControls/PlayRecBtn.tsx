import React from "react";
import { Circle, Play } from "lucide-react";
import {
  useLoopStore,
  LoopState_Rec,
} from "../../../../data/store/LoopStore.ts";

export const PlayRecBtn: React.FC<{ trackIndex: number }> = ({
  trackIndex,
}) => {
  const { tracks, startRecording, stopRecording } = useLoopStore();

  const track = tracks?.[trackIndex];

  if (!track) {
    console.error(`Invalid track index: ${trackIndex}`, tracks);
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
