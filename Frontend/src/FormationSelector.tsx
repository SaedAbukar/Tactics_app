import React, { useState } from "react";
import type { Formation, Team } from "./types";

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
  const now = Date.now(); // milliseconds
  if (now === lastTime) {
    counter++;
  } else {
    lastTime = now;
    counter = 0;
  }
  // now * 1000 ensures room for counter up to 999 per millisecond
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
    if (!selectedFormation) {
      alert("Please select a formation.");
      return;
    }

    const formation = formations.find((f) => f.name === selectedFormation);
    if (!formation) {
      alert("Invalid formation selected.");
      return;
    }

    const teamObj = teams.find((t) => t.id === selectedTeamId);
    const defaultColor = "white";

    const scaledPlayers = formation.teams.flatMap(() =>
      formation.teams[0].positions.map((pos, idx) => {
        let x = pos.x * pitchWidth;
        let y = pos.y * pitchHeight;

        // If there are already players on the pitch for other teams
        if (currentPlayersCount > 0) {
          // Reverse formation vertically instead of mirroring horizontally
          y = pitchHeight - y - 50;
          x = x; // keep original x
        }

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

    if (scaledPlayers.length === 0) {
      alert("Cannot add formation: no positions available.");
      return;
    }

    onAddFormation(scaledPlayers);
  };

  return (
    <div style={{ marginTop: 10, color: "white" }}>
      <label>Team: </label>
      <select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(Number(e.target.value) || undefined)}
      >
        <option value="">No Team</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <label style={{ marginLeft: 10 }}>Formation: </label>
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

      <button style={{ marginLeft: 10 }} onClick={handleAddFormation}>
        Add Formation
      </button>
    </div>
  );
};
