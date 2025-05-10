import { SettingsPanel } from "./components/settingsPanel/SettingsPanel.tsx";
import { WorkshopPanel } from "./components/workshopPanel/WorkshopPanel.tsx";
import { GlobalFxPanel } from "./components/globalFxPanel/GlobalFxPanel.tsx";
import { TrackFxPanel } from "./components/trackFxPanel/TrackFxPanel.tsx";
import { LoopPanel } from "./components/loopPanel/LoopPanel.tsx";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useState } from "react";
import { useFXStore } from "@data/store/FXStore.ts";

function App() {
  const bundleArray = useFXStore((state) => state.bundleArray);
  const activeBundle = bundleArray.find((bdl) => bdl.bundleIsSelected) ?? null;

  const [activeBundleID, setActiveBundleID] = useState(null);
  const [droppedBundles, setDroppedBundles] = useState<{
    [trackIndex: number]: number[];
  }>({});

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(pointerSensor);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveBundleID(e.active.data.current?.bundleID);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveBundleID(null);

    if (!over) return;

    const activeBundleID = active.data.current?.bundleID;
    const trackIndex = over.data.current?.trackIndex;

    if (activeBundleID != null && trackIndex != null) {
      setDroppedBundles((prev) => ({
        ...prev,
        [trackIndex]: [...(prev[trackIndex] || []), activeBundleID],
      }));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[snapCenterToCursor]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="mx-auto w-[95%] h-70 flex flex-row justify-between items-center gap-10 mb-[2.6rem]">
          <SettingsPanel />
          <WorkshopPanel />
          <GlobalFxPanel />
        </div>
        <TrackFxPanel droppedBundles={droppedBundles} />
        <LoopPanel />
      </div>
      <DragOverlay>
        <div
          className={
            "w-11 h-11 rounded-lg cursor-pointer border-2 border-[#959595] text-[#959595] flex flex-row justify-center items-center"
          }
        >
          {activeBundleID != null ? String(activeBundleID + 1) : "null"}
        </div>
      </DragOverlay>
    </DndContext>
  );
}

export default App;
