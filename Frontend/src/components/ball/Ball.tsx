import React from "react";
import type { Ball, DragItem } from "../../types/types";

interface BallsProps {
  balls: Ball[];
  dragRef: React.RefObject<DragItem | null>;
  setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
}

const Balls: React.FC<BallsProps> = ({ balls, dragRef }) => {
  const handleMouseDown = (id: number) => () => {
    dragRef.current = { type: "ball", id };
  };

  return (
    <>
      {balls.map((b) => (
        <circle
          key={b.id}
          cx={b.x}
          cy={b.y}
          r={10}
          fill="white"
          stroke="black"
          strokeWidth={2.5}
          onMouseDown={handleMouseDown(b.id)}
          style={{ cursor: "grab" }}
        />
      ))}
    </>
  );
};

export default Balls;
