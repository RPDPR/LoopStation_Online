import React from "react";
import { useLoopStore } from "../../../../data/store/LoopStore.ts";
import { useState } from "react";

export const FXBtn: React.FC<{ trackIndex: number }> = ({ trackIndex }) => {
  const { toggleEffects } = useLoopStore();
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleClick = () => {
    toggleEffects(trackIndex);
    setIsActive(!isActive);
  };

  return (
    <div className="w-25 mt-1 ml-1 mb-2 flex justify-between">
      <button
        className={
          isActive
            ? "bg-green-700/70 px-3 py-1 rounded-md cursor-pointer flex mr-4 transition-colors duration-150"
            : "bg-white/10 px-3 py-1 rounded-md cursor-pointer flex mr-4 transition-colors duration-150"
        }
        onClick={handleClick}
      >
        FX
      </button>
    </div>
  );
};
