import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <div className={`flex items-center ${className || ""}`}>
      <div className="w-1 h-6 bg-[#FF5733] rounded-sm mr-3" />
      <h3 className="text-[24px] font-bold text-[#212121]">{children}</h3>
    </div>
  );
}


