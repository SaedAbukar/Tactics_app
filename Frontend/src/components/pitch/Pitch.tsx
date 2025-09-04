import React from "react";
import type {
  Player,
  Ball,
  Goal,
  Cone,
  DragItem,
  Team,
} from "../../types/types";
import PitchField from "../pitch_field/PitchField";
import Players from "../player/Player";
import Balls from "../ball/Ball";
import GoalComponent from "../goal/Goal";
import ConeComponent from "../cone/Cone";

interface PitchProps {
  players: Player[];
  balls: Ball[];
  goals: Goal[];
  cones: Cone[];
  teams?: Team[];
  dragRef: React.RefObject<DragItem | null>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setCones: React.Dispatch<React.SetStateAction<Cone[]>>;
  width?: number;
  height?: number;
}

export const Pitch: React.FC<PitchProps> = ({
  players,
  balls,
  goals,
  cones,
  dragRef,
  setPlayers,
  setBalls,
  setGoals,
  setCones,
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

    switch (currentDrag.type) {
      case "player":
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === currentDrag.id ? { ...p, x: cursor.x, y: cursor.y } : p
          )
        );
        break;
      case "ball":
        setBalls((prev) =>
          prev.map((b) =>
            b.id === currentDrag.id ? { ...b, x: cursor.x, y: cursor.y } : b
          )
        );
        break;
      case "goal":
        setGoals((prev) =>
          prev.map((g) =>
            g.id === currentDrag.id
              ? { ...g, x: cursor.x - g.width / 2, y: cursor.y - g.depth / 2 }
              : g
          )
        );
        break;
      case "cone":
        setCones((prev) =>
          prev.map((c) =>
            c.id === currentDrag.id ? { ...c, x: cursor.x, y: cursor.y } : c
          )
        );
        break;
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
      <ConeComponent cones={cones} dragRef={dragRef} setCones={setCones} />
    </svg>
  );
};
