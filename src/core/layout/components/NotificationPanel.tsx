import React, { useState, useRef, useEffect } from "react";
import styles from "../Header/Header.module.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type NotificationType = "emergency" | "success" | "info" | "default";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const NOTIF_CONFIG: Record<
  NotificationType,
  { emoji: string; dotColor: string; bgColor: string; iconBg: string }
> = {
  emergency: {
    emoji: "🚨",
    dotColor: "#f97316",
    bgColor: "#fffbeb",
    iconBg: "#fed7aa",
  },
  success: {
    emoji: "✅",
    dotColor: "#10b981",
    bgColor: "#f0fdf4",
    iconBg: "#a7f3d0",
  },
  info: {
    emoji: "📅",
    dotColor: "#3b82f6",
    bgColor: "#fffbeb",
    iconBg: "#dbeafe",
  },
  default: {
    emoji: "👤",
    dotColor: "transparent",
    bgColor: "#fff",
    iconBg: "#e9d5ff",
  },
};

const BellIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────────

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} className={styles.notifWrap}>
      {/* Bell button */}
      <button
        className={styles.notifBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className={styles.notifDot} aria-hidden="true" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className={styles.notifPanel} role="dialog" aria-label="Notifications">
          {/* Header */}
          <div className={styles.notifPanelHeader}>
            <span className={styles.notifPanelTitle}>Notifications</span>
            {unreadCount > 0 && (
              <span className={styles.notifBadge}>{unreadCount} New</span>
            )}
          </div>

          {/* Items */}
          <ul className={styles.notifList}>
            {notifications.map((notif) => {
              const config = NOTIF_CONFIG[notif.type];
              return (
                <li
                  key={notif.id}
                  className={styles.notifItem}
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div
                    className={styles.notifItemIcon}
                    style={{ backgroundColor: config.iconBg }}
                    aria-hidden="true"
                  >
                    {config.emoji}
                  </div>
                  <div className={styles.notifItemBody}>
                    <p className={styles.notifItemTitle}>{notif.title}</p>
                    <p className={styles.notifItemMsg}>{notif.message}</p>
                    <span className={styles.notifItemTime}>{notif.timeAgo}</span>
                  </div>
                  {!notif.read && (
                    <span
                      className={styles.notifUnreadDot}
                      style={{ backgroundColor: config.dotColor }}
                      aria-label="Unread"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className={styles.notifPanelFooter}>
            <button className={styles.notifMarkAllBtn} onClick={onMarkAllRead}>
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;