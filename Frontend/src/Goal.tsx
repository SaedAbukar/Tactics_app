import React from "react";
import type { Goal, DragItem } from "./types";

interface GoalProps {
  goals: Goal[];
  dragRef: React.RefObject<DragItem | null>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalComponent: React.FC<GoalProps> = ({ goals, dragRef, setGoals }) => {
  const handleMouseDown = (e: React.MouseEvent, goalId: number) => {
    dragRef.current = { type: "goal", id: goalId };
    e.stopPropagation();
  };

  return (
    <>
      {goals.map((g) => (
        <rect
          key={g.id}
          x={g.x}
          y={g.y}
          width={g.width}
          height={g.depth}
          fill="white"
          stroke={g.color || "yellow"}
          onMouseDown={(e) => handleMouseDown(e, g.id)}
          style={{ cursor: "grab" }}
        />
      ))}
    </>
  );
};

export default GoalComponent;
