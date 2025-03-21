import { useState, useRef, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { useLoopStore } from "../../../../data/store/LoopStore.ts";

export const BpmAdjuster = () => {
  const { setBpm } = useLoopStore();
  const [bpm, sBpm] = useState(120);
  const timeoutRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) {
      setBpm(bpm);
    }
  }, [bpm, setBpm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    sBpm(value);
  };

  const handleBlur = () => {
    isEditingRef.current = false;
    sBpm((prev) => {
      const clampedBpm = Math.min(Math.max(40, prev), 320);

      requestAnimationFrame(() => setBpm(clampedBpm));

      return clampedBpm;
    });
  };

  const handleFocus = () => {
    isEditingRef.current = true;
  };

  const changeBPM = (delta: number, speed = 300) => {
    if (!isHoldingRef.current) return;
    sBpm((prev) => {
      const newBpm = Math.min(Math.max(40, prev + delta), 320);
      return newBpm;
    });

    timeoutRef.current = window.setTimeout(
      () => changeBPM(delta, Math.max(50, speed - 50)),
      speed
    );
  };

  const handleMouseDown = (delta: number) => {
    isHoldingRef.current = true;
    timeoutRef.current = window.setTimeout(() => changeBPM(delta, 250), 250);
  };

  const handleMouseUp = () => {
    isHoldingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className="h-20 w-[90%] flex flex-col items-center relative mb-1">
      <div className="mb-2">
        <p>BPM</p>
      </div>
      <div className="h-12 w-[90%] bg-[#353535] flex items-center justify-center border-violet-600 border-2 rounded-lg shadow-[0_0_20px_rgba(20,20,20,0.3)] inset-shadow-[0_0_30px_rgba(20,20,20,0.5)] relative">
        <button
          onClick={() =>
            sBpm((prev) => {
              const newBpm = Math.max(40, prev - 1);
              return newBpm;
            })
          }
          onMouseDown={() => handleMouseDown(-1)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute left-3 text-white"
        >
          <Minus size={15} />
        </button>

        <div className="relative flex justify-center items-center">
          <input
            type="number"
            value={bpm}
            min="40"
            max="320"
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className="text-white text-xl font-bold text-center bg-transparent border-none outline-none w-[60px] appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <button
          onClick={() =>
            sBpm((prev) => {
              const newBpm = Math.min(320, prev + 1);
              return newBpm;
            })
          }
          onMouseDown={() => handleMouseDown(1)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute right-3 text-white"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
};
