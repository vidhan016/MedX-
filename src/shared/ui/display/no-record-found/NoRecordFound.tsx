import React from "react";
import "./NoRecordFound.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NoRecordFoundAction {
  /** Label for the clickable action link */
  label: string;
  onClick: () => void;
}

export interface NoRecordFoundProps {
  /** Main message text shown before the action link */
  message: string;
  /** Optional action link rendered inline inside the message */
  action?: NoRecordFoundAction;
  /** Text shown after the action link */
  suffix?: string;
  /** Extra class names on the wrapper */
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const NoRecordFound: React.FC<NoRecordFoundProps> = ({
  message,
  action,
  suffix,
  className = "",
}) => {
  return (
    <div className={`nrf-wrap ${className}`.trim()}>
      {message}{" "}
      {action && (
        <>
          <button className="nrf-action" onClick={action.onClick}>
            {action.label}
          </button>
          {suffix && <> {suffix}</>}
        </>
      )}
    </div>
  );
};

export default NoRecordFound;