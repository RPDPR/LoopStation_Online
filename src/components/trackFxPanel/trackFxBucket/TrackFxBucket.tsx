import { TTrackProps } from "../../loopPanel/loop/Loop.tsx";

export const TrackFxBucket: React.FC<TTrackProps> = ({ trackIndex }) => {
  return (
    <div className="bg-white/2 mx-auto w-[14%] h-[100px] rounded-4xl shadow-[0_0_30px_rgb(30,30,30)] flex items-center justify-center">
      <div className="bg-white/2 mx-auto w-[95%] h-[86px] rounded-4xl border-violet-600 border-2 inset-shadow-[0_0_30px_rgba(20,20,20,0.5)] pt-6 pl-6 flex flex-row">
        <div className="w-15"></div>
        <div className="w-15"></div>
        <div className="w-15"></div>
        <div className="w-15"></div>
        <div className="w-15"></div>
      </div>
    </div>
  );
};
