import { SettingsPanel } from "./components/settingsPanel/SettingsPanel.tsx";
import { WorkshopPanel } from "./components/workshopPanel/WorkshopPanel.tsx";
import { GlobalFxPanel } from "./components/globalFxPanel/GlobalFxPanel.tsx";
import { TrackFxPanel } from "./components/trackFxPanel/TrackFxPanel.tsx";
import { LoopPanel } from "./components/loopPanel/LoopPanel.tsx";

function App() {
  return (
    <div>
      <div className="mx-auto w-[95%] h-70 flex flex-row justify-between items-center gap-10 mb-[2.6rem]">
        <SettingsPanel />
        <WorkshopPanel />
        <GlobalFxPanel />
      </div>
      <TrackFxPanel />
      <LoopPanel />
    </div>
  );
}

export default App;
