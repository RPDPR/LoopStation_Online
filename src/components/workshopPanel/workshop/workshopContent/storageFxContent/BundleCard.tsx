import { useState } from "react";

import {
  useFXStore,
  Bundle,
  fxNames,
} from "../../../../../data/store/FXStore.ts";

type T_BundleCard = {
  bundleID: number;
};

export const BundleCard: React.FC<T_BundleCard> = ({ bundleID }) => {
  const bundleArray = useFXStore((state) => state.bundleArray);
  const setBundleActivity = useFXStore((state) => state.setBundleActivity);

  const bundle = bundleArray.find((b) => b.bundleID === bundleID);
  const isActive = bundle?.bundleIsActive ?? false;

  const handleClick = () => {
    bundleArray.forEach((bundle) => {
      setBundleActivity(bundle.bundleID, bundle.bundleID === bundleID);
    });
  };

  return (
    <div className="w-12 h-full text-xs text-left flex flex-row items-end py-2 pl-2">
      <div
        onClick={handleClick}
        className={
          "w-full h-full rounded-lg cursor-pointer border-2 " +
          (isActive
            ? "border-[#959595] text-[#959595] hover:border-[#959595] hover:text-[#959595]"
            : "border-[#757575] text-[#757575] hover:border-[#858585] hover:text-[#858585]") +
          " flex flex-row justify-center items-center transition-color duration-150"
        }
      >
        {"B-" + String(bundleID + 1)}
      </div>
    </div>
  );
};
