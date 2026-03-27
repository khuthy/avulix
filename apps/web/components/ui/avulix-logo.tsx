interface AvulixLogoProps {
  /** "dark" = dark background → right diamond white, "liX" white
   *  "light" = light background → right diamond dark, "liX" dark */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { svg: "h-6 w-6", text: "text-lg" },
  md: { svg: "h-7 w-7", text: "text-xl" },
  lg: { svg: "h-8 w-8", text: "text-2xl" },
};

export function AvulixLogo({ variant = "dark", size = "md", className = "" }: AvulixLogoProps) {
  const { svg, text } = sizes[size];
  const rightDiamond = variant === "dark" ? "#FFFFFF" : "#13132B";
  const lixColor = variant === "dark" ? "#FFFFFF" : "#1A2340";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className={`${svg} flex-shrink-0 overflow-visible`} fill="none">
        <path d="M10 50L35 10L60 50L35 90L10 50Z" fill="#C42126" />
        <path d="M40 50L65 10L90 50L65 90L40 50Z" fill={rightDiamond} />
        <path d="M40 50L50 34L60 50L50 66L40 50Z" fill="#A4C639" />
      </svg>
      <span className={`font-extrabold ${text} leading-none tracking-tight`}>
        <span style={{ color: "#C0392B" }}>Avu</span>
        <span style={{ color: lixColor }}>liX</span>
      </span>
    </div>
  );
}
