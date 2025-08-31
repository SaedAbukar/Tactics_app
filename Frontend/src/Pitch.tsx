import React from "react";
import type { Player, Ball, Goal, Team, DragItem } from "./types";
import PitchField from "./PitchField";
import Players from "./Players";
import Balls from "./Balls";
import GoalComponent from "./Goal";

interface PitchProps {
  players: Player[];
  balls: Ball[];
  goals: Goal[];
  teams: Team[];
  dragRef: React.RefObject<DragItem | null>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  width?: number;
  height?: number;
}

export const Pitch: React.FC<PitchProps> = ({
  players,
  balls,
  goals,
  teams,
  dragRef,
  setPlayers,
  setBalls,
  setGoals,
  width = 700,
  height = 900,
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
    } else if (currentDrag.type === "goal" && currentDrag.id !== undefined) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === currentDrag.id
            ? { ...g, x: cursor.x - g.width / 2, y: cursor.y - g.depth / 2 }
            : g
        )
      );
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  return (
    <svg
      width={width}
      height={height}
      style={{ background: "#0b6623", marginTop: 10 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <PitchField width={width} height={height} />
      <Players players={players} dragRef={dragRef} setPlayers={setPlayers} />
      <Balls balls={balls} dragRef={dragRef} setBalls={setBalls} />
      <GoalComponent goals={goals} dragRef={dragRef} setGoals={setGoals} />
    </svg>
  );
};
