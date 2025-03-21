import { createLucideIcon, CirclePower, Volume2, Music } from "lucide-react";
import { useState, useRef } from "react";
import { useLoopStore } from "../../../../data/store/LoopStore.ts";
export const MIcon = createLucideIcon("Metronome", [
  ["path", { d: "M6 20 L9 4 H15 L18 20 Z", key: "body" }],
  ["line", { x1: "12", y1: "6", x2: "12", y2: "14", key: "stick" }],
  ["circle", { cx: "12", cy: "10", r: "1.5", key: "weight" }],
  ["line", { x1: "6", y1: "20", x2: "18", y2: "20", key: "base" }],
]);

export const Metronome: React.FC = () => {
  const { startMetronome, stopMetronome, updateMetronome, bpm } =
    useLoopStore();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedMeasure, setSelectedMeasure] = useState("4/4");
  const measure = useRef<number>(4);
  const noteValue = useRef<number>(4);

  const handlePower: React.MouseEventHandler<HTMLInputElement> = () => {
    if (!isActive) {
      startMetronome(bpm, Number(measure.current), Number(noteValue.current));
    } else {
      stopMetronome();
    }
    setIsActive(!isActive);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMetronome({ volume: Number(e.target.value) });
  };

  const handleMeasureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newMeasure, newNoteValue] = e.target.value.split("/").map(Number);

    measure.current = newMeasure;
    noteValue.current = newNoteValue;
    updateMetronome({ measure: newMeasure, noteValue: newNoteValue });

    setSelectedMeasure(e.target.value);
  };

  return (
    <div className="h-38 w-[90%] flex flex-col items-center relative pt-2">
      <div className="mb-2">
        <MIcon size={32} strokeWidth={1} />
      </div>
      <div className="h-full w-[90%] bg-[#353535] flex flex-col border-violet-600 border-2 p-2.5 rounded-lg shadow-[0_0_20px_rgba(20,20,20,0.3)] inset-shadow-[0_0_30px_rgba(20,20,20,0.5)] relative">
        {/* Power */}
        <div className="flex flex-row justify-between items-center px-0.5 mb-1">
          <div className="flex justify-center items-center">
            <CirclePower size={20} strokeWidth={1.5} />
          </div>
          <div className="flex justify-center items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onClick={handlePower}
              />
              <div className="relative w-11 h-6 bg-[#757575] rounded-full peer dark:bg-gray-700 dark:peer-focus:ring-violet-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600 dark:peer-checked:bg-violet-600" />
            </label>
          </div>
        </div>
        {/* Volume */}
        <div className="flex flex-row justify-between items-center px-0.5 mb-1">
          <div className="flex justify-center items-center">
            <Volume2 size={20} strokeWidth={1.5} />
          </div>
          <div className="w-11 flex justify-center items-center">
            <input
              type="range"
              min="0"
              max="100"
              onChange={handleVolumeChange}
              className="w-full h-1 bg-[#757575] rounded-lg appearance-none cursor-pointer 
             [&::-webkit-slider-thumb]:appearance-none 
             [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
             [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
             [&::-webkit-slider-thumb]:cursor-pointer 
             [&::-webkit-slider-thumb]:transition-colors 
             [&::-webkit-slider-thumb]:hover:bg-gray-200 
             [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
             [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full 
             [&::-moz-range-thumb]:cursor-pointer 
             [&::-moz-range-thumb]:transition-colors 
             [&::-moz-range-thumb]:hover:bg-gray-200"
            />
          </div>
        </div>
        {/* Measure */}
        <div className="flex flex-row justify-between items-center pl-0.5 pr-1.5">
          <div className="flex justify-center items-center">
            <Music size={20} strokeWidth={1.5} />
          </div>
          <div className="flex justify-center items-center">
            <select
              id="time-signature"
              className="bg-[#757575] border border-[#757575] text-white text-sm rounded-lg focus:border-white block p-1 appearance-none text-center"
              style={{ textAlignLast: "center" }}
              value={selectedMeasure}
              onChange={handleMeasureChange}
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="2/4">2/4</option>
              <option value="1/4">1/4</option>
              <option value="4/2">4/8</option>
              <option value="3/2">3/8</option>
              <option value="2/2">2/8</option>
              <option value="1/2">1/8</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
