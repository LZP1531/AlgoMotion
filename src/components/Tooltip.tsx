import { type ReactNode, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  label: string;
  children: ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  return (
    <span
      className="tooltip-anchor"
      onMouseEnter={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2,
        });
      }}
      onMouseLeave={() => setPosition(null)}
      onFocus={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2,
        });
      }}
      onBlur={() => setPosition(null)}
    >
      {children}
      {position &&
        createPortal(
          <span className="app-tooltip" style={{ top: position.top, left: position.left }}>
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
}
