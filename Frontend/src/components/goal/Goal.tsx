import React from "react";
import type { Goal, DragItem } from "../../types/types";

interface GoalProps {
  goals: Goal[];
  dragRef: React.RefObject<DragItem | null>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalComponent: React.FC<GoalProps> = ({ goals, dragRef }) => {
  const handleMouseDown = (e: React.MouseEvent, goalId: number) => {
    dragRef.current = { type: "goal", id: goalId };
    e.stopPropagation();
  };

  return (
    <>
      {goals.map((g) => {
        const netRows = 4;
        const netCols = 6;
        const rowSpacing = g.depth / netRows;
        const colSpacing = g.width / netCols;

        return (
          <g
            key={g.id}
            onMouseDown={(e) => handleMouseDown(e, g.id)}
            style={{ cursor: "grab" }}
          >
            {/* Goal frame */}
            <rect
              x={g.x}
              y={g.y}
              width={g.width}
              height={g.depth}
              fill="transparent"
              stroke="white"
              strokeWidth={4}
            />
            {/* Net lines */}
            {Array.from({ length: netRows + 1 }).map((_, i) => (
              <line
                key={`row-${i}`}
                x1={g.x}
                y1={g.y + i * rowSpacing}
                x2={g.x + g.width}
                y2={g.y + i * rowSpacing}
                stroke="black"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: netCols + 1 }).map((_, i) => (
              <line
                key={`col-${i}`}
                x1={g.x + i * colSpacing}
                y1={g.y}
                x2={g.x + i * colSpacing}
                y2={g.y + g.depth}
                stroke="black"
                strokeWidth={1}
              />
            ))}
          </g>
        );
      })}
    </>
  );
};

export default GoalComponent;
