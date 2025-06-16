import { PlayRecBtn } from "@loop/loopControls/PlayRecBtn.tsx";
import { StopBtn } from "@loop/loopControls/StopBtn.tsx";
import { TrackFxBtn } from "@loop/loopControls/TrackFxBtn.tsx";
import { MasterFxBtn } from "@loop/loopControls/MasterFxBtn.tsx";
import { VolumeSlider } from "@loop/loopControls/VolumeSlider.tsx";
import { ProgressBar } from "@loop/loopControls/ProgressBar.tsx";
import { TrackIndex } from "@data/store/LoopStoreTypes.ts";

export type T_Loop = {
  trackIndex: TrackIndex;
};

export const Loop: React.FC<T_Loop> = ({ trackIndex }) => {
  return (
    <div className="bg-white/2 mx-auto w-[13%] h-50 rounded-4xl border-violet-600 border-2 shadow-[0_0_30px_rgba(20,20,20,0.5)] inset-shadow-[0_0_30px_rgba(20,20,20,0.5)] pt-6 pl-6 flex flex-row">
      <div className="w-15">
        <TrackFxBtn trackIndex={trackIndex} />
        <StopBtn trackIndex={trackIndex} />
        <PlayRecBtn trackIndex={trackIndex} />
      </div>
      <div className="w-15">
        <MasterFxBtn trackIndex={trackIndex} />
        <VolumeSlider trackIndex={trackIndex} />
      </div>
      <div className="w-15">
        <ProgressBar trackIndex={trackIndex} />
      </div>
    </div>
  );
};
