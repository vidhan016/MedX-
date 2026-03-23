import React from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./Avataar.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

export type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Initials shown when no image is available */
  initials?: string;
  /** Preset size — or use `customSize` for arbitrary dimensions */
  size?: AvatarSize;
  /** Custom size — overrides `size` preset. Any valid CSS length e.g. "48px", "3rem" */
  customSize?: string;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Background color when showing initials or icon */
  bg?: string;
  /** Text / icon color when showing initials */
  color?: string;
  /** Icon rendered inside instead of initials — pass any ReactNode */
  icon?: React.ReactNode;
  /** Status indicator dot */
  status?: AvatarStatus;
  /** Extra class names */
  className?: string;
  /** React Query: cache key for fetching remote avatar src */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning an image URL string */
  queryFn?: () => Promise<string>;
}

// ── Status color map ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online:  "#22c55e",
  offline: "#9ca3af",
  busy:    "#ef4444",
  away:    "#f59e0b",
};

// ── Shape class map ────────────────────────────────────────────────────────────

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle:  "rounded-full",
  rounded: "rounded-lg",
  square:  "rounded-none",
};

// ── Initials helper ────────────────────────────────────────────────────────────

const getInitials = (text: string): string =>
  text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// ── Component ──────────────────────────────────────────────────────────────────

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  initials,
  size = "md",
  customSize,
  shape = "circle",
  bg = "var(--bs-primary-bg-subtle)",
  color = "var(--bs-primary)",
  icon,
  status,
  className = "",
  queryKey,
  queryFn,
}) => {
  // ── React Query — fetch remote avatar URL ──
  const { data: fetchedSrc } = useQuery<string>({
    queryKey: queryKey ?? ["avatar"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: src,
  });

  const resolvedSrc = fetchedSrc ?? src;

  const sizeStyle: React.CSSProperties = customSize
    ? { width: customSize, height: customSize }
    : {};

  const sizeClass  = customSize ? "" : `avatar-${size}`;
  const shapeClass = SHAPE_CLASSES[shape];

  const wrapperClasses = [
    "avatar",
    "overflow-hidden",
    sizeClass,
    shapeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} style={sizeStyle}>
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={alt}
          className={`avatar-img-size w-full h-full object-cover ${shapeClass}`}
        />
      ) : (
        <div
          className={`avatar-title text-xs font-semibold select-none ${shapeClass}`}
          style={{ background: bg, color }}
        >
          {icon ?? (initials ? getInitials(initials) : "?")}
        </div>
      )}

      {status && (
        <span
          className="avatar-status"
          style={{ background: STATUS_COLORS[status] }}
          aria-label={status}
        />
      )}
    </div>
  );
};

// ── AvatarGroup ────────────────────────────────────────────────────────────────

export type AvatarGroupSize = "xs" | "sm" | "md";

export interface AvatarGroupProps {
  children: React.ReactNode;
  groupSize?: AvatarGroupSize;
  max?: number;
  className?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  groupSize = "md",
  max,
  className = "",
}) => {
  const items   = React.Children.toArray(children);
  const visible = max ? items.slice(0, max) : items;
  const overflow = max ? items.length - max : 0;

  const groupClass = [
    "avatar-group",
    groupSize === "sm" ? "avatar-group-sm" : "",
    groupSize === "xs" ? "avatar-group-xs" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={groupClass}>
      {visible}
      {overflow > 0 && (
        <div className="avatar avatar-md rounded-full overflow-hidden">
          <div
            className="avatar-title text-xs font-semibold select-none rounded-full"
            style={{
              background: "var(--bs-secondary-bg-subtle)",
              color: "var(--bs-secondary)",
            }}
          >
            +{overflow}
          </div>
        </div>
      )}
    </div>
  );
};

export { AvatarGroup };
export default Avatar;