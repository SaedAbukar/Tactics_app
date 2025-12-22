import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import type { Goal, DragItem } from "../../types/types";

interface GoalProps {
  goals: Goal[];
  dragRef: React.RefObject<DragItem | null>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  selectedItem: DragItem | null;
}

const GoalComponent: React.FC<GoalProps> = observer(
  ({ goals, dragRef, selectedItem }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const SCALE = isMobile ? 2.0 : 1.5;

    const handleMouseDown = (e: React.MouseEvent, goalId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "goal", id: goalId };
    };

    const handleTouchStart = (e: React.TouchEvent, goalId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "goal", id: goalId };
    };

    return (
      <>
        {goals.map((g) => {
          const isSelected =
            selectedItem?.type === "goal" && selectedItem.id === g.id;

          const renderWidth = g.width * SCALE;
          const renderDepth = g.depth * SCALE;

          // [Diagram of Center-Based Rendering]
          // The stored (g.x, g.y) is the CENTER (Red Dot)
          // We calculate the drawing start point (Top-Left) by subtracting half width/height
          //
          // (drawX, drawY) ┌──────────────┐
          //                │              │
          //                │      • (x,y) │
          //                │              │
          //                └──────────────┘

          const drawX = g.x - renderWidth / 2;
          const drawY = g.y - renderDepth / 2;

          const netRows = isMobile ? 4 : 8;
          const netCols = isMobile ? 6 : 12;

          const rowSpacing = renderDepth / netRows;
          const colSpacing = renderWidth / netCols;

          return (
            <g
              key={g.id}
              onMouseDown={(e) => handleMouseDown(e, g.id)}
              onTouchStart={(e) => handleTouchStart(e, g.id)}
              style={{ cursor: "grab" }}
            >
              {/* Main Goal Frame */}
              <rect
                x={drawX}
                y={drawY}
                width={renderWidth}
                height={renderDepth}
                fill="transparent"
                stroke={isSelected ? "yellow" : "white"}
                strokeWidth={isSelected ? 6 : 4}
              />

              {/* Net Horizontal Lines */}
              {Array.from({ length: netRows + 1 }).map((_, i) => (
                <line
                  key={`row-${i}`}
                  x1={drawX}
                  y1={drawY + i * rowSpacing}
                  x2={drawX + renderWidth}
                  y2={drawY + i * rowSpacing}
                  stroke="black"
                  strokeWidth={1}
                  pointerEvents="none"
                />
              ))}

              {/* Net Vertical Lines */}
              {Array.from({ length: netCols + 1 }).map((_, i) => (
                <line
                  key={`col-${i}`}
                  x1={drawX + i * colSpacing}
                  y1={drawY}
                  x2={drawX + i * colSpacing}
                  y2={drawY + renderDepth}
                  stroke="black"
                  strokeWidth={1}
                  pointerEvents="none"
                />
              ))}
            </g>
          );
        })}
      </>
    );
  }
);

export default GoalComponent;
