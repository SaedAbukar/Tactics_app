import React from "react";
import { observer } from "mobx-react-lite";
import type { Cone, DragItem } from "../../types/types";

interface ConeProps {
  cones: Cone[];
  dragRef: React.RefObject<DragItem | null>;
  setCones: React.Dispatch<React.SetStateAction<Cone[]>>;
}

const ConeComponent: React.FC<ConeProps> = observer(({ cones, dragRef }) => {
  const handleMouseDown = (e: React.MouseEvent, coneId: number) => {
    e.stopPropagation();
    if (dragRef) dragRef.current = { type: "cone", id: coneId };
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
          style={{ cursor: "grab" }}
        />
      ))}
    </>
  );
});

export default ConeComponent;
