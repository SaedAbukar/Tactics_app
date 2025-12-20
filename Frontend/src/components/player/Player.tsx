import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import type { Player, DragItem } from "../../types/types";

interface PlayersProps {
  players: Player[];
  dragRef: React.RefObject<DragItem | null>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedItem: DragItem | null;
}

const Players: React.FC<PlayersProps> = observer(
  ({ players, dragRef, selectedItem }) => {
    // 1. Detect Screen Size
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 2. Define Sizes based on screen
    const RADIUS = isMobile ? 30 : 14;
    const STROKE = isMobile ? 6 : 4; // Thicker border on mobile to see selection

    const handleMouseDown = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      if (dragRef && dragRef.current !== undefined) {
        dragRef.current = { type: "player", id };
      }
    };

    const handleTouchStart = (e: React.TouchEvent, id: number) => {
      e.stopPropagation();
      if (dragRef && dragRef.current !== undefined) {
        dragRef.current = { type: "player", id };
      }
    };

    return (
      <>
        {players.map((p) => {
          const isSelected =
            selectedItem?.type === "player" && selectedItem.id === p.id;

          return (
            <React.Fragment key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={RADIUS} // ✅ Dynamic Radius
                fill={p.color}
                stroke={isSelected ? "yellow" : "white"}
                strokeWidth={isSelected ? STROKE : 2}
                onMouseDown={(e) => handleMouseDown(e, p.id)}
                onTouchStart={(e) => handleTouchStart(e, p.id)}
                style={{ cursor: "grab" }}
              />
              {/* Optional Text (Adjust fontSize if needed) */}
              {/* <text
                x={p.x}
                y={p.y + (isMobile ? 8 : 5)}
                fontSize={isMobile ? 18 : 12}
                fill={p.color === "white" ? "black" : "white"}
                textAnchor="middle"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {p.number}
              </text> */}
            </React.Fragment>
          );
        })}
      </>
    );
  }
);

export default Players;
