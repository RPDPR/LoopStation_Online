import { SettingsPanel } from "./components/settingsPanel/SettingsPanel.tsx";
import { WorkshopPanel } from "./components/workshopPanel/WorkshopPanel.tsx";
import { GlobalFxPanel } from "./components/globalFxPanel/GlobalFxPanel.tsx";
import { TrackFxPanel } from "./components/trackFxPanel/TrackFxPanel.tsx";
import { LoopPanel } from "./components/loopPanel/LoopPanel.tsx";

import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { useFXStore } from "@data/store/FXStore.ts";

function App() {
  const bundleArray = useFXStore((state) => state.bundleArray);
  const activeBundle = bundleArray.find((bdl) => bdl.bundleIsSelected) ?? null;

  const [isDropped, setIsDropped] = useState(false);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    console.log(activeData, overData);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div className="mx-auto w-[95%] h-70 flex flex-row justify-between items-center gap-10 mb-[2.6rem]">
          <SettingsPanel />
          <WorkshopPanel />
          <GlobalFxPanel />
        </div>
        <TrackFxPanel />
        <LoopPanel />
      </div>
      <DragOverlay>
        <div
          className={
            "w-10 h-10 rounded-lg cursor-pointer border-2 border-[#959595] text-[#959595] flex flex-row justify-center items-center transition-color duration-150"
          }
        >
          {activeBundle ? String(activeBundle.bundleID) : "null"}
        </div>
      </DragOverlay>
    </DndContext>
  );
}

export default App;
