import { FC } from "react";
import { CreateFxArea } from "./workshopContent/CreateFxArea.tsx";
import { SetUpFxArea } from "./workshopContent/SetUpFxArea.tsx";
import { SetUpTrackBundleArea } from "./workshopContent/SetUpTrackBundleArea.tsx";
import { StorageFxArea } from "./workshopContent/StorageFxArea.tsx";

export const Workshop: FC = () => {
  return (
    <div className="mx-auto w-full h-full rounded-2xl grid grid-cols-[4fr_fr] grid-rows-[3fr_1fr] gap-x-3">
      <div className="w-full h-full grid grid-cols-[1fr_2fr] grid-rows-[3fr_1fr] gap-x-3">
        <div>
          <CreateFxArea />
        </div>
        <div>
          <SetUpFxArea />
        </div>
        <div>
          <StorageFxArea />
        </div>
      </div>
      <div>
        <SetUpTrackBundleArea />
      </div>
    </div>
  );
};
