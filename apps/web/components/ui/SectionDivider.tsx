interface SectionDividerProps {
  topColor?: string;
  bottomColor?: string;
  className?: string;
}

export function SectionDivider({
  topColor = "#ffffff",
  bottomColor = "#F5F6F8",
  className,
}: SectionDividerProps) {
  return (
    <div className={`relative h-16 overflow-hidden ${className ?? ""}`} style={{ backgroundColor: bottomColor }}>
      <svg
        viewBox="0 0 1440 64"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M0 0 C360 64 1080 64 1440 0 L1440 0 L0 0 Z"
          fill={topColor}
        />
      </svg>
    </div>
  );
}
