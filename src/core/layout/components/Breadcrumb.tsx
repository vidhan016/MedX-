import React from "react";
import "./Breadcrumb.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  /** Displayed label */
  label: string;
  /** Called when this item is clicked — omit for the active/last item */
  onClick?: () => void;
  /** Icon rendered before the label */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Separator string or ReactNode between items — defaults to ">" */
  separator?: React.ReactNode;
  /** Extra class names on the wrapper */
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = ">",
  className = "",
}) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="breadcrumb">
      <ol className={`breadcrumb ${className}`.trim()}>
        {items.map((item, i) => {
          const isActive = i === items.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  {separator}
                </span>
              )}
              <li
                className={`breadcrumb-item ${isActive ? "breadcrumb-item--active" : ""}`}
                onClick={!isActive ? item.onClick : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon && (
                  <span className="mr-1 inline-flex items-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;