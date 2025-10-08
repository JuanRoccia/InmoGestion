interface AdBannerProps {
  width: "full" | 1200 | 590;
  height: 150 | 250;
  className?: string;
}

export default function AdBanner({ width, height, className }: AdBannerProps) {
  const label = `${width === 590 ? 590 : 1200}x${height}`;
  return (
    <div
      className={`bg-[#F5F5F5] border-2 border-dashed border-[#E0E0E0] flex items-center justify-center text-center ${className || ""}`}
      style={{ height: `${height}px`, width: "100%" }}
    >
      <div className="text-[#757575]">
        <div className="text-base font-medium">Espacio publicitario</div>
        <div className="text-sm">{label}</div>
      </div>
    </div>
  );
}


