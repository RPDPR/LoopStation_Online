type T_FXCard = {
  fxName: string;
};

export const FXCard: React.FC<T_FXCard> = ({ fxName }) => {
  return (
    <div className="w-full h-5.5 text-xs text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] border-b-2 border-b-[#353535] cursor-pointer hover:bg-[#858585] flex flex-row text-nowrap flex-nowrap items-center overflow-hidden px-3">
      <div className="text-white">{fxName}</div>
    </div>
  );
};
