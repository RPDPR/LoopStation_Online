import { CreateFxArea } from "./workshopContent/CreateFxArea.tsx";
import { SetUpFxArea } from "./workshopContent/SetUpFxArea.tsx";
import { StorageFxArea } from "./workshopContent/StorageFxArea.tsx";

export const Workshop: React.FC = () => {
  return (
    <div className="mx-auto w-full h-full rounded-2xl grid gap-x-3 gap-y-4 grid-cols-3 grid-rows-[3fr_1fr]">
      <CreateFxArea />
      <SetUpFxArea />
      <StorageFxArea />
    </div>
  );
};
