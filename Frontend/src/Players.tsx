import React from "react";
import type { Player, DragItem } from "./types";

interface PlayersProps {
  players: Player[];
  dragRef: React.RefObject<DragItem | null>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const Players: React.FC<PlayersProps> = ({ players, dragRef, setPlayers }) => {
  const handleMouseDown = (id: number) => () => {
    dragRef.current = { type: "player", id };
  };

  return (
    <>
      {players.map((p) => (
        <React.Fragment key={p.id}>
          <circle
            cx={p.x}
            cy={p.y}
            r={15}
            fill={p.color}
            onMouseDown={handleMouseDown(p.id)}
            style={{ cursor: "grab" }}
          />
          <text
            x={p.x}
            y={p.y + 5}
            fontSize={12}
            fill="white"
            textAnchor="middle"
          >
            {p.number}
          </text>
        </React.Fragment>
      ))}
    </>
  );
};

export default Players;
