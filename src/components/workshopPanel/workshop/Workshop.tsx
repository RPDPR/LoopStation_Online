import { TTrackProps } from "../../loopPanel/loop/Loop.tsx";

export const Workshop: React.FC<TTrackProps> = ({ trackIndex }) => {
  return (
    <div className="mx-auto w-full h-full rounded-4xl pt-6 pl-6 flex flex-row">
      <div className="w-15"></div>
      <div className="w-15"></div>
      <div className="w-15"></div>
      <div className="w-15"></div>
      <div className="w-15"></div>
    </div>
  );
};
