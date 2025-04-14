import React from "react";
import { useFXStore } from "../../../../../../data/store/FXStore.ts";

type T_BundleHeader = {
  bundleSelectedID: number;
};

export const BundleHeader: React.FC<T_BundleHeader> = ({
  bundleSelectedID,
}) => {
  const setBundleName = useFXStore((state) => state.setBundleName);
  const bundleArray = useFXStore((state) => state.bundleArray);
  const bundle = bundleArray[bundleSelectedID];
  const bundleUserID = bundle.bundleID + 1;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = bundle.bundleName;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (String(e.target.value).length > 8) {
      setBundleName(bundle.bundleID, String(e.target.value).slice(0, 8));
    } else if (String(e.target.value).length > 0) {
      setBundleName(bundle.bundleID, String(e.target.value));
    }
    return (e.target.value = "");
  };

  return (
    <div className="w-full h-5 flex flex-row items-center gap-x-3 basis-1/3">
      <div className="w-full flex flex-row justify-between items-center gap-x-1 basis-1/5">
        <div className="text-xs leading-none">ID:</div>
        <div className="text-xs leading-none text-white/40">
          {String(bundleUserID)}
        </div>
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center gap-x-1 basis-4/5">
        <div className="text-xs leading-none">Name:</div>
        <div className="w-15">
          <input
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full h-full text-xs placeholder-white/40 leading-none text-center border-b-1 border-[#757575] outline-none"
            type="text"
            placeholder={String(bundle.bundleName)}
          />
        </div>
      </div>
    </div>
  );
};
