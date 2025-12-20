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

    // ✅ Dynamic Scale Factor
    const SCALE = isMobile ? 2.0 : 1.0;

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

          // Reduce net density on small screens to prevent clutter
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
              <rect
                x={g.x}
                y={g.y}
                width={renderWidth}
                height={renderDepth}
                fill="transparent"
                stroke={isSelected ? "yellow" : "white"}
                strokeWidth={isSelected ? 6 : 4}
              />

              {Array.from({ length: netRows + 1 }).map((_, i) => (
                <line
                  key={`row-${i}`}
                  x1={g.x}
                  y1={g.y + i * rowSpacing}
                  x2={g.x + renderWidth}
                  y2={g.y + i * rowSpacing}
                  stroke="black"
                  strokeWidth={1}
                  pointerEvents="none"
                />
              ))}

              {Array.from({ length: netCols + 1 }).map((_, i) => (
                <line
                  key={`col-${i}`}
                  x1={g.x + i * colSpacing}
                  y1={g.y}
                  x2={g.x + i * colSpacing}
                  y2={g.y + renderDepth}
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
