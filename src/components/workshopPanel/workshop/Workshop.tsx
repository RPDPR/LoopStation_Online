import { FC } from "react";
import { CreateFxArea } from "./workshopContent/CreateFxArea.tsx";
import { SetUpFxArea } from "./workshopContent/SetUpFxArea.tsx";
import { SetUpBundleArea } from "./workshopContent/SetUpBundleArea.tsx";
import { SetUpTrackArea } from "./workshopContent/SetUpTrackArea.tsx";
import { StorageFxArea } from "./workshopContent/StorageFxArea.tsx";

export const Workshop: FC = () => {
  return (
    <div className="mx-auto w-full h-full rounded-2xl grid gap-x-3 gap-y-4 grid-cols-9 grid-rows-[3fr_1fr]">
      <CreateFxArea />
      <SetUpFxArea />
      <StorageFxArea />
      <div className="h-full w-full grid grid-cols-1 grid-rows-[1fr_1fr] col-span-2 col-start-8 row-start-1 row-span-2 gap-y-3">
        <SetUpBundleArea />
        <SetUpTrackArea />
      </div>
    </div>
  );
};
