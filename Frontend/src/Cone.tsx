import React from "react";
import type { Cone, DragItem } from "./types";

interface ConeProps {
  cones: Cone[];
  dragRef: React.RefObject<DragItem | null>;
  setCones: React.Dispatch<React.SetStateAction<Cone[]>>;
}

const ConeComponent: React.FC<ConeProps> = ({ cones, dragRef, setCones }) => {
  const handleMouseDown = (e: React.MouseEvent, coneId: number) => {
    dragRef.current = { type: "cone", id: coneId };
    e.stopPropagation();
  };

  return (
    <>
      {cones.map((c) => (
        <polygon
          key={c.id}
          points={`${c.x},${c.y} ${c.x + 10},${c.y + 20} ${c.x - 10},${
            c.y + 20
          }`}
          fill={c.color || "orange"}
          stroke="black"
          onMouseDown={(e) => handleMouseDown(e, c.id)}
        />
      ))}
    </>
  );
};

export default ConeComponent;
