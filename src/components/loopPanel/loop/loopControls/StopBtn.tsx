import React from "react";
import { Square } from "lucide-react";
import { useLoopStore } from "../../../../data/store/LoopStore.ts";

export const StopBtn: React.FC<{ trackIndex: number }> = ({ trackIndex }) => {
  const { stopLoop } = useLoopStore();
  const handleClick = () => {
    stopLoop(trackIndex);
  };
  return (
    <div className="w-12 h-12 mb-2 flex justify-center items-center">
      <button
        className="cursor-pointer flex justify-center items-center"
        onClick={handleClick}
      >
        <div className="border-2 border-[#757575] w-[44px] h-[44px] rounded-full flex justify-center items-center">
          {" "}
          <Square size={20} color="#757575" fill="#757575" />
        </div>
      </button>
    </div>
  );
};
