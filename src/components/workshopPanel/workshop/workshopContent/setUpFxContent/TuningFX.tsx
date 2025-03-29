import { TuningFX_Card } from "./TuningFXContent/TuningFX_Card.tsx";

export const TuningFX: React.FC = () => {
  return (
    <div className="w-full h-full grid grid-cols-2 auto-rows-max gap-2 overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1 basis-2/3">
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
    </div>
  );
};
