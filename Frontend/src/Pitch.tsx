import React from "react";
import type { Player, Ball, DragItem } from "./types";

interface PitchProps {
  players: Player[];
  balls: Ball[];
  dragRef: React.RefObject<DragItem>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
}

export const Pitch: React.FC<PitchProps> = ({
  players,
  balls,
  dragRef,
  setPlayers,
  setBalls,
}) => {
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const currentDrag = dragRef.current;
    if (!currentDrag) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    if (currentDrag.type === "player" && currentDrag.id !== undefined) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === currentDrag.id ? { ...p, x: cursor.x, y: cursor.y } : p
        )
      );
    } else if (currentDrag.type === "ball" && currentDrag.id !== undefined) {
      setBalls((prev) =>
        prev.map((b) =>
          b.id === currentDrag.id ? { ...b, x: cursor.x, y: cursor.y } : b
        )
      );
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  const handleMouseDownPlayer = (id: number) => () => {
    dragRef.current = { type: "player", id };
  };

  const handleMouseDownBall = (id: number) => () => {
    dragRef.current = { type: "ball", id };
  };

  return (
    <svg
      width={800}
      height={400}
      style={{ background: "green", marginTop: 10 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <rect
        x={0}
        y={0}
        width={800}
        height={400}
        fill="none"
        stroke="white"
        strokeWidth={2}
      />

      {players.map((p) => (
        <React.Fragment key={p.id}>
          <circle
            cx={p.x}
            cy={p.y}
            r={15}
            fill={p.color}
            onMouseDown={handleMouseDownPlayer(p.id)}
            style={{ cursor: "grab" }}
          />
          <text
            x={p.x}
            y={p.y + 5}
            fontSize={12}
            fill="white"
            textAnchor="middle"
          >
            {p.id}
          </text>
        </React.Fragment>
      ))}

      {balls.map((b) => (
        <circle
          key={b.id}
          cx={b.x}
          cy={b.y}
          r={10}
          fill="white"
          stroke="black"
          onMouseDown={handleMouseDownBall(b.id)}
          style={{ cursor: "grab" }}
        />
      ))}
    </svg>
  );
};
