import React from "react";
import { Settings } from "./settings/Settings.tsx";

export const SettingsPanel: React.FC = () => {
  return (
    <div className="bg-white/2 mx-auto w-[95%] h-[280px] rounded-4xl shadow-[0_0_30px_rgb(30,30,30)] flex justify-center items-center basis-1/4 mb-[1.5rem]">
      <Settings />
    </div>
  );
};
