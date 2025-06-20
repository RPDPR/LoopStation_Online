import { FC } from "react";
import { useLoopStore } from "@data/store/LoopStore.ts";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";

type T_DryWet = {
  selectedTrackIndex: TrackIndex;
};

export const DryWet: FC<T_DryWet> = ({ selectedTrackIndex }) => {
  const setTrackParams = useLoopStore((state) => state.setTrackParams);
  const updateTrackFXs = useLoopStore((state) => state.updateTrackFXs);
  const trackArray = useLoopStore((state) => state.trackArray);
  const track = trackArray[selectedTrackIndex];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackParams(selectedTrackIndex, { dryWetValue: Number(e.target.value) });
    updateTrackFXs(selectedTrackIndex);
  };

  return (
    <div className="w-full h-5 flex flex-row items-center gap-x-3">
      <div className="w-7 flex justify-center items-center">
        <input
          type="range"
          min={track.trackParams.dryWet.min}
          max={track.trackParams.dryWet.max}
          step={track.trackParams.dryWet.step}
          className="w-full h-1 bg-[#757575] rounded-lg appearance-none cursor-pointer 
               [&::-webkit-slider-thumb]:appearance-none 
               [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
               [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
               [&::-webkit-slider-thumb]:cursor-pointer 
               [&::-webkit-slider-thumb]:transition-colors 
               [&::-webkit-slider-thumb]:hover:bg-gray-200 
               [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
               [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full 
               [&::-moz-range-thumb]:cursor-pointer 
               [&::-moz-range-thumb]:transition-colors 
               [&::-moz-range-thumb]:hover:bg-gray-200"
          value={track.trackParams.dryWet.value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
