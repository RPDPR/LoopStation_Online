import React from "react";
import { useState } from "react";

export const TrackBtn: React.FC<{ trackIndex: number }> = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="w-17 mt-1 mb-2 flex justify-between">
      <button
        className={
          isActive
            ? "bg-green-700/70 px-2 py-1 rounded-md cursor-pointer flex transition-colors duration-150"
            : "bg-white/10 px-2 py-1 rounded-md cursor-pointer flex transition-colors duration-150"
        }
        onClick={handleClick}
      >
        TRACK
      </button>
    </div>
  );
};
