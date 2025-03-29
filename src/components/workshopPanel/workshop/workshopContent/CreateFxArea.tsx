import { FXCard } from "./createFxContent/FXCard.tsx";

export const CreateFxArea: React.FC = () => {
  return (
    <div className="bg-[#353535] shadow-[0_0_10px_rgba(20,20,20,0.5)] inset-shadow-[0_0_10px_rgba(20,20,20,0.2)] rounded-2xl h-full overflow-hidden col-span-1 pl-2 pr-1 py-2">
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#757575] [&::-webkit-scrollbar-thumb]:rounded-lg pr-1">
        <FXCard name={"Phaser"} />
        <FXCard name={"EQ"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
        <FXCard name={"Reverb"} />
      </div>
    </div>
  );
};
