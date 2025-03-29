import * as Tone from "tone";
import React from "react";

type T_TuningFX_Card = {
  FX_Params: Record<string, unknown>;
};

export const TuningFX_Card: React.FC<T_TuningFX_Card> = ({ FX_Params }) => {
  return (
    <div className="h-10 bg-[#757575] overflow-hidden rounded-lg flex flex-row items-center pl-5">
      <div className="flex space-x-4">
        {Object.entries(FX_Params).map(([paramName, paramValue]) => (
          <div key={paramName} className="text-sm">
            {paramName}: {String(paramValue)}{" "}
          </div>
        ))}
      </div>
    </div>
  );
};
