import React from "react";
import { Workshop } from "./workshop/Workshop.tsx";

export const WorkshopPanel: React.FC = () => {
  return (
    <div className=" bg-white/2 mx-auto w-[95%] h-[280px] rounded-4xl shadow-[0_0_30px_rgb(30,30,30)] flex justify-center items-center basis-2/4 mb-[1.5rem] p-6">
      <Workshop />
    </div>
  );
};
