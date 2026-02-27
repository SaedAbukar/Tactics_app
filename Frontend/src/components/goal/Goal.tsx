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

    // --- Main Goal Drag Handlers ---
    const handleMouseDown = (e: React.MouseEvent, goalId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "goal", id: goalId };
    };

    const handleTouchStart = (e: React.TouchEvent, goalId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "goal", id: goalId };
    };

    // --- Rotation Handle Drag Handlers ---
    const handleRotateMouseDown = (e: React.MouseEvent, goalId: number) => {
      e.stopPropagation(); // Prevents triggering the main goal drag or pitch click
      if (dragRef) dragRef.current = { type: "goal-rotate", id: goalId };
    };

    const handleRotateTouchStart = (e: React.TouchEvent, goalId: number) => {
      e.stopPropagation();
      if (dragRef) dragRef.current = { type: "goal-rotate", id: goalId };
    };

    return (
      <>
        {goals.map((g) => {
          // Keep selected if either the goal OR the rotation handle is active
          const isSelected =
            (selectedItem?.type === "goal" ||
              selectedItem?.type === "goal-rotate") &&
            selectedItem.id === g.id;

          const renderWidth = g.width * SCALE;
          const renderDepth = g.depth * SCALE;

          const drawX = g.x - renderWidth / 2;
          const drawY = g.y - renderDepth / 2;

          const netRows = isMobile ? 4 : 8;
          const netCols = isMobile ? 6 : 12;

          const rowSpacing = renderDepth / netRows;
          const colSpacing = renderWidth / netCols;

          return (
            <g
              key={g.id}
              // Apply rotation around the absolute center (g.x, g.y)
              transform={`rotate(${g.rotation || 0} ${g.x} ${g.y})`}
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
                style={{ cursor: "grab" }}
                onMouseDown={(e) => handleMouseDown(e, g.id)}
                onTouchStart={(e) => handleTouchStart(e, g.id)}
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

              {/* Rotating Arrow Handle Above the Goal */}
              {isSelected && (
                <g
                  // Positioned centered X, and Y is offset ABOVE the goal
                  transform={`translate(${g.x}, ${g.y - renderDepth / 2 - (isMobile ? 35 : 25)})`}
                  style={{ cursor: "grab" }}
                  onMouseDown={(e) => handleRotateMouseDown(e, g.id)}
                  onTouchStart={(e) => handleRotateTouchStart(e, g.id)}
                >
                  {/* Dark circular background for high contrast & easy grabbing */}
                  <circle
                    r={isMobile ? 18 : 14}
                    fill="rgba(30, 41, 59, 0.8)"
                    stroke="white"
                    strokeWidth={1}
                  />

                  {/* Rotating Arrow SVG Path */}
                  <path
                    d="M -4.5 -4.5 A 6.5 6.5 0 1 1 -6 1.5 L -6 4.5 M -6 1.5 L -2.5 1.5"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </g>
          );
        })}
      </>
    );
  },
);

export default GoalComponent;
