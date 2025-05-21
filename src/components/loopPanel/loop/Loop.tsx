import { PlayRecBtn } from "./loopControls/PlayRecBtn.tsx";
import { StopBtn } from "./loopControls/StopBtn.tsx";
import { TrackFxBtn } from "./loopControls/TrackFxBtn.tsx";
import { MasterFxBtn } from "./loopControls/MasterFxBtn.tsx";
import { VolumeSlider } from "./loopControls/VolumeSlider.tsx";
import { ProgressBar } from "./loopControls/ProgressBar.tsx";

export type TTrackProps = {
  trackIndex: number;
};

export const Loop: React.FC<TTrackProps> = ({ trackIndex }) => {
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
