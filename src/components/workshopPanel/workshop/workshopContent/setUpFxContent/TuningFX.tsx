import { TuningFX_Card } from "./TuningFXContent/TuningFX_Card.tsx";

export const TuningFX: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#353535] border-2 border-black/10 rounded-lg inset-shadow-[0_0_20px_rgba(20,20,20,0.3)] grid grid-cols-2 auto-rows-max gap-2 overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg py-1 pr-1 pl-1 basis-2/3">
      <TuningFX_Card FX_Params={{ low: 3, sas: 3 }} />
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
