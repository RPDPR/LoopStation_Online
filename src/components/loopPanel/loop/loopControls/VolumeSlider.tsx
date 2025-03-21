import React from "react";
import { useState } from "react";
import { useLoopStore } from "../../../../data/store/LoopStore.ts";

export const VolumeSlider: React.FC<{ trackIndex: number }> = ({
  trackIndex,
}) => {
  const { tracks, changeVolume } = useLoopStore();
  const [volume, setVolume] = useState<number>(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const track = tracks?.[trackIndex];

    if (!track) {
      console.error(`Invalid track index: ${trackIndex}`, tracks);
      return null;
    }

    //main
    setVolume(Number(e.target.value));
    changeVolume(trackIndex, Number(e.target.value));
    //main
  };

  return (
    <div className="flex flex-col items-center w-10 pt-8 pl-6">
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleChange}
        className="w-24 h-10 appearance-none bg-[#353535] rounded-lg accent-amber-500 rotate-[-90deg] origin-center [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-10 
      [&::-webkit-slider-thumb]:bg-[#727272] [&::-webkit-slider-thumb]:rounded-md
      [&::-webkit-slider-thumb]:shadow-md shadow-[0_0_20px_rgba(20,20,20,0.3)] inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
};
