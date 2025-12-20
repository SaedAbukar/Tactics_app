import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import type { Ball, DragItem } from "../../types/types";

interface BallsProps {
  balls: Ball[];
  dragRef: React.RefObject<DragItem | null>;
  setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
  selectedItem: DragItem | null;
}

const Balls: React.FC<BallsProps> = observer(
  ({ balls, dragRef, selectedItem }) => {
    // 1. Detect Screen Size
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 2. Define Sizes
    const RADIUS = isMobile ? 20 : 8;
    const STROKE_WIDTH = isMobile ? 4 : 2;

    const handleMouseDown = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "ball", id };
    };

    const handleTouchStart = (e: React.TouchEvent, id: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "ball", id };
    };

    return (
      <>
        {balls.map((b) => {
          const isSelected =
            selectedItem?.type === "ball" && selectedItem.id === b.id;

          return (
            <circle
              key={b.id}
              cx={b.x}
              cy={b.y}
              r={RADIUS} // ✅ Dynamic Radius
              fill="white"
              stroke={isSelected ? "yellow" : "black"}
              strokeWidth={isSelected ? (isMobile ? 8 : 4) : STROKE_WIDTH}
              onMouseDown={(e) => handleMouseDown(e, b.id)}
              onTouchStart={(e) => handleTouchStart(e, b.id)}
              style={{ cursor: "grab" }}
            />
          );
        })}
      </>
    );
  }
);

export default Balls;
