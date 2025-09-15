export default function QuickTile({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[69px] rounded-lg border border-[rgba(198,198,198,0.98)] shadow-[0_0_4px_rgba(0,0,0,0.25)] bg-white flex flex-col items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
    >
      <div className="w-7 h-7 flex items-center justify-center">{icon}</div>
      <div className="text-[12px] leading-[21px] tracking-[-0.25px]">
        {label}
      </div>
    </button>
  );
}
