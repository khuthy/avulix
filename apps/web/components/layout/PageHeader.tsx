import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "#9DA3B4" }}
                />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-xs font-medium transition-colors hover:text-[#1A2340]"
                  style={{ color: "#9DA3B4" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-xs font-medium" style={{ color: "#4A5168" }}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold sm:text-2xl" style={{ color: "#1F2533" }}>
            {title}
          </h1>
          {description && (
            <p className="text-sm mt-0.5" style={{ color: "#9DA3B4" }}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>
    </div>
  );
}
