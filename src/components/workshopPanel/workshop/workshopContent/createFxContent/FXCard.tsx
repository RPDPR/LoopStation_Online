type T_FXCard = {
  name: string;
};

export const FXCard: React.FC<T_FXCard> = ({ name }) => {
  return (
    <div className="w-full h-5.5 text-sm text-left first:rounded-t-lg last:rounded-b-lg bg-[#757575] border-b-2 border-b-[#353535] cursor-pointer hover:bg-[#858585] flex flex-row items-center pl-5">
      <div className="text-white flex-1/3 ">{name}</div>
      <div className="text-white flex-1/3"></div>
      <div className="text-white flex-1/3"></div>
    </div>
  );
};
