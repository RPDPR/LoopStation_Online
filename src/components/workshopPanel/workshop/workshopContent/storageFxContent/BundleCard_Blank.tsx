import React from "react";
import { Plus } from "lucide-react";
import { useFXStore } from "@data/store/FXStore.ts";

export const BundleCard_Blank: React.FC = () => {
  const addBundle = useFXStore((state) => state.addBundle);

  function generateRandomBundleName(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    addBundle();
  };

  return (
    <div className="min-w-12 w-12 h-full text-xs text-left flex flex-row items-end py-2 pl-2">
      <div
        onClick={handleClick}
        className="w-full h-full rounded-lg cursor-pointer border-2 border-dashed border-[#757575] hover:border-[#858585] text-[#757575] hover:text-[#858585] flex flex-row justify-center items-center transition-color duration-150"
      >
        <Plus size={20} />
      </div>
    </div>
  );
};
