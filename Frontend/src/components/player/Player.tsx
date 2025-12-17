import React from "react";
import { observer } from "mobx-react-lite"; // 1. Import observer
import type { Player, DragItem } from "../../types/types";

interface PlayersProps {
  players: Player[];
  dragRef: React.RefObject<DragItem | null>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

// 2. Wrap component
const Players: React.FC<PlayersProps> = observer(({ players, dragRef }) => {
  const handleMouseDown = (id: number) => () => {
    // If dragRef is a proxy object (from our VM bridge), this works perfectly
    if (dragRef && dragRef.current !== undefined) {
      dragRef.current = { type: "player", id };
    }
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
            fill={p.color === "white" ? "black" : "white"}
            textAnchor="middle"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {p.number}
          </text>
        </React.Fragment>
      ))}
    </>
  );
});

export default Players;
