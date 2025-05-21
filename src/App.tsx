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
import { useLoopStore } from "@data/store/LoopStore.ts";

import {
  ContainerFxBundle,
  ContainerFxBundleID,
  BundleContainerTypeElem,
} from "@data/store/LoopStoreTypes.ts";

function App() {
  const [bundleID, setBundleID] = useState<ContainerFxBundleID | null>(null); // for every droppable areas
  const updateFxBundlesContainer = useLoopStore(
    (state) => state.updateFxBundlesContainer
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
    setBundleID(active.data.current?.containerFxBundleID);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { active /*draggable elem*/, over /*droppable elem*/ } = e;

    const containerFxBundleID: ContainerFxBundleID =
      active.data.current?.containerFxBundleID;
    const containerFxBundle: ContainerFxBundle =
      active.data.current?.containerFxBundle;

    const drag_bundleContainerType: BundleContainerTypeElem =
      active?.data.current?.bundleContainerType;
    const drop_bundleContainerType: BundleContainerTypeElem =
      over?.data.current?.bundleContainerType;

    const drag_trackIndex: number = active?.data.current?.trackIndex;
    const drop_trackIndex: number = over?.data.current?.trackIndex;

    setBundleID(null);

    const isSameDroppableContainer =
      drag_bundleContainerType === drop_bundleContainerType &&
      drag_trackIndex === drop_trackIndex;

    if (!over) {
      if (!drag_bundleContainerType && !drop_bundleContainerType) return;
      //updating
      updateFxBundlesContainer(drag_bundleContainerType, {
        operationType: "DELETE",
        trackIndex: drag_trackIndex,
        containerFxBundleID: containerFxBundleID,
      });
      updateTrackFXs(drag_trackIndex);
      return;
    }

    if (isSameDroppableContainer) return;

    if (drag_bundleContainerType != null) {
      //updating
      updateFxBundlesContainer(drag_bundleContainerType, {
        operationType: "DELETE",
        trackIndex: drag_trackIndex,
        containerFxBundleID: containerFxBundleID,
      });
      updateTrackFXs(drag_trackIndex);
    }
    if (drop_bundleContainerType != null) {
      //updating
      updateFxBundlesContainer(drop_bundleContainerType, {
        operationType: "ADD",
        trackIndex: drop_trackIndex,
        containerFxBundle: containerFxBundle,
      });
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
          {bundleID != null ? String(bundleID + 1) : "null"}
        </div>
      </DragOverlay>
    </DndContext>
  );
}

export default App;
