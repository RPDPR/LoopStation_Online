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
import { useLoopStore } from "@data/store/LoopStore.ts";

import { TrackIndex } from "@data/store/LoopStoreTypes.ts";
import { BundleID, BundleContainerType } from "@data/store/FXStoreTypes.ts";

function App() {
  const [overlayBundleID, setOverlayBundleID] = useState<BundleID | null>(null); // for every droppable areas
  const updateBundleConnections = useFXStore(
    (state) => state.updateBundleConnections
  );
  const updateTrackFXs = useLoopStore((state) => state.updateTrackFXs);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(pointerSensor);

  const handleDragStart = (e: DragStartEvent) => {
    const { active /*draggable elem*/ } = e;
    setOverlayBundleID(active.data.current?.bundleID);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { active /*draggable elem*/, over /*droppable elem*/ } = e;

    const bundleID: BundleID = active.data.current?.bundleID;

    const drag_bundleContainerType: BundleContainerType =
      active?.data.current?.bundleContainerType;
    const drop_bundleContainerType: BundleContainerType =
      over?.data.current?.bundleContainerType;

    const drag_trackIndex: TrackIndex = active?.data.current?.trackIndex;
    const drop_trackIndex: TrackIndex = over?.data.current?.trackIndex;

    setOverlayBundleID(null);
    console.log(bundleID);
    const isSameDroppableContainer =
      drag_bundleContainerType === drop_bundleContainerType &&
      drag_trackIndex === drop_trackIndex;

    if (!over) {
      if (!drag_bundleContainerType && !drop_bundleContainerType) return;
      //updating
      updateBundleConnections(
        bundleID,
        "DELETE",
        drag_bundleContainerType,
        drag_trackIndex
      );
      updateTrackFXs(drag_trackIndex);
      return;
    }

    if (isSameDroppableContainer) return;

    if (drag_bundleContainerType != null) {
      //updating
      updateBundleConnections(
        bundleID,
        "DELETE",
        drag_bundleContainerType,
        drag_trackIndex
      );
      updateTrackFXs(drag_trackIndex);
    }
    if (drop_bundleContainerType != null) {
      //updating
      updateBundleConnections(
        bundleID,
        "ADD",
        drop_bundleContainerType,
        drop_trackIndex
      );
      updateTrackFXs(drop_trackIndex);
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
        <TrackFxPanel />
        <LoopPanel />
      </div>
      <DragOverlay>
        <div
          className={
            "w-11 h-11 rounded-lg cursor-pointer border-2 border-[#959595] text-[#959595] flex flex-row justify-center items-center"
          }
        >
          {overlayBundleID != null ? String(overlayBundleID + 1) : "null"}
        </div>
      </DragOverlay>
    </DndContext>
  );
}

export default App;
