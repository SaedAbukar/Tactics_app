import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import type { Cone, DragItem } from "../../types/types";

interface ConeProps {
  cones: Cone[];
  dragRef: React.RefObject<DragItem | null>;
  setCones: React.Dispatch<React.SetStateAction<Cone[]>>;
  selectedItem: DragItem | null;
}

const ConeComponent: React.FC<ConeProps> = observer(
  ({ cones, dragRef, selectedItem }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calculate dimensions
    const OFFSET = isMobile ? 25 : 12; // Half width
    const HEIGHT = isMobile ? 35 : 20;

    const handleMouseDown = (e: React.MouseEvent, coneId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "cone", id: coneId };
    };

    const handleTouchStart = (e: React.TouchEvent, coneId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "cone", id: coneId };
    };

    return (
      <>
        {cones.map((c) => {
          const isSelected =
            selectedItem?.type === "cone" && selectedItem.id === c.id;

          return (
            <polygon
              key={c.id}
              // ✅ Dynamic Points Calculation
              points={`${c.x},${c.y} ${c.x + OFFSET},${c.y + HEIGHT} ${
                c.x - OFFSET
              },${c.y + HEIGHT}`}
              fill={c.color || "orange"}
              stroke={isSelected ? "yellow" : "black"}
              strokeWidth={isSelected ? 3 : 1}
              onMouseDown={(e) => handleMouseDown(e, c.id)}
              onTouchStart={(e) => handleTouchStart(e, c.id)}
              style={{ cursor: "grab" }}
            />
          );
        })}
      </>
    );
  }
);

export default ConeComponent;
