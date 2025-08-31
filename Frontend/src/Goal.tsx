import React from "react";
import type { Goal, DragItem } from "./types";

interface GoalComponentProps {
  goals: Goal[];
  dragRef: React.RefObject<DragItem | null>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalComponent: React.FC<GoalComponentProps> = ({
  goals,
  dragRef,
  setGoals,
}) => {
  const handleMouseDown = (id: number) => () => {
    dragRef.current = { type: "goal", id };
  };

  return (
    <>
      {goals.map((goal) => (
        <rect
          key={goal.id}
          x={goal.x}
          y={goal.y}
          width={goal.width}
          height={goal.depth}
          fill="none"
          stroke="yellow"
          strokeWidth={2}
          onMouseDown={handleMouseDown(goal.id)}
          style={{ cursor: "grab" }}
        />
      ))}
    </>
  );
};

export default GoalComponent;
