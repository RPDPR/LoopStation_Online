import { OutputGain } from "./BundleSettings_Content/OutputGain.tsx";
import { DryWet } from "./BundleSettings_Content/DryWet.tsx";

type T_BundleSettings = {
  bundleSelectedID: number;
};

export const BundleSettings: React.FC<T_BundleSettings> = ({
  bundleSelectedID,
}) => {
  return (
    <div className="w-full h-full flex flex-row justify-between items-center gap-x-3 basis-1/3">
      <div className="w-full h-5 flex flex-row justify-between items-center basis-48/100">
        <div className="text-xs leading-none">Gain:</div>
        <div>
          <OutputGain bundleSelectedID={bundleSelectedID} />
        </div>
      </div>
      <div className="w-full h-5 flex flex-row justify-between items-center pr-1 basis-52/100">
        <div className="text-xs leading-none">D/W:</div>
        <div>
          <DryWet bundleSelectedID={bundleSelectedID} />
        </div>
      </div>
    </div>
  );
};
