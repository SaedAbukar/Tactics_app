import React, { useState } from "react";
import type { Formation, Team } from "./types";
import "./FormationSelector.css";

interface FormationSelectorProps {
  formations: Formation[];
  teams: Team[];
  pitchWidth: number;
  pitchHeight: number;
  currentPlayersCount: number;
  onAddFormation: (scaledPlayers: any[]) => void;
}

// ID generator for numeric IDs
let lastTime = 0;
let counter = 0;
function generateId(): number {
  const now = Date.now();
  if (now === lastTime) counter++;
  else {
    lastTime = now;
    counter = 0;
  }
  return now * 1000 + counter;
}

let playerNumber = 1;

export const FormationSelector: React.FC<FormationSelectorProps> = ({
  formations,
  teams,
  pitchWidth,
  pitchHeight,
  currentPlayersCount,
  onAddFormation,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
    undefined
  );
  const [selectedFormation, setSelectedFormation] = useState<string>("");

  const handleAddFormation = () => {
    if (!selectedFormation) return alert("Please select a formation.");

    const formation = formations.find((f) => f.name === selectedFormation);
    if (!formation) return alert("Invalid formation selected.");

    const teamObj = teams.find((t) => t.id === selectedTeamId);
    const defaultColor = "white";

    const scaledPlayers = formation.teams.flatMap(() =>
      formation.teams[0].positions.map((pos) => {
        let x = pos.x * pitchWidth;
        let y = pos.y * pitchHeight;

        if (currentPlayersCount > 0) y = pitchHeight - y - 50;

        return {
          id: generateId(),
          number: playerNumber++,
          x,
          y,
          color: teamObj?.color || defaultColor,
          teamId: selectedTeamId,
        };
      })
    );

    if (!scaledPlayers.length)
      return alert("Cannot add formation: no positions available.");

    onAddFormation(scaledPlayers);
  };

  return (
    <div className="formation-selector-container">
      <div className="formation-row">
        <label>Team:</label>
        <select
          value={selectedTeamId}
          onChange={(e) =>
            setSelectedTeamId(Number(e.target.value) || undefined)
          }
        >
          <option value="">No Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="formation-row">
        <label>Formation:</label>
        <select
          value={selectedFormation}
          onChange={(e) => setSelectedFormation(e.target.value)}
        >
          <option value="">Select Formation</option>
          {formations.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
        <button className="light-button" onClick={handleAddFormation}>
          Add Formation
        </button>
      </div>
    </div>
  );
};
