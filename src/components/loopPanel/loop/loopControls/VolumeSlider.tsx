import { FC, useState } from "react";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";

export type T_VolumeSlider = {
  trackIndex: TrackIndex;
};

export const VolumeSlider: FC<T_VolumeSlider> = ({ trackIndex }) => {
  const track = useLoopStore((state) => state.trackArray[trackIndex]);
  const changeVolume = useLoopStore((state) => state.changeVolume);

  const [volume, setVolume] = useState<number>(track.volume ?? 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!track) {
      console.error(`Invalid track index: ${trackIndex}`, track);
      return;
    }
    const newVolume = Number(e.target.value);

    setVolume(newVolume);
    changeVolume(trackIndex, newVolume);
  };

  return (
    <div className="flex flex-col items-center w-10 pt-8 pl-6">
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleChange}
        className="w-24 h-10 appearance-none bg-[#353535] rounded-lg rotate-[-90deg] origin-center [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-10 
      [&::-webkit-slider-thumb]:bg-[#727272] [&::-webkit-slider-thumb]:rounded-md
      [&::-webkit-slider-thumb]:shadow-md shadow-[0_0_20px_rgba(20,20,20,0.3)] inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
};
