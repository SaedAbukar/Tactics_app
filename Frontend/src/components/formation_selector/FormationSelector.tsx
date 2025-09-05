import React, { useState } from "react";
import type { Formation, Team } from "../../types/types";
import { useFetch } from "../../hooks/useFetch";
import { fetchFormations } from "../../mock/formationsAPI";
import { useTranslation } from "react-i18next";
import "./FormationSelector.css";

interface FormationSelectorProps {
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
  teams,
  pitchWidth,
  pitchHeight,
  currentPlayersCount,
  onAddFormation,
}) => {
  const { t } = useTranslation("tacticalEditor"); // Translation hook
  const { data, loading, error } = useFetch(fetchFormations);
  const formations = data || [];
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
    undefined
  );
  const [selectedFormation, setSelectedFormation] = useState<string>("");

  const handleAddFormation = () => {
    // if (!selectedTeamId) return alert(t("formationSelector.selectTeamAlert"));
    if (!selectedFormation)
      return alert(t("formationSelector.selectFormationAlert"));

    const formation = formations.find((f) => f.name === selectedFormation);
    if (!formation) return alert(t("formationSelector.invalidFormationAlert"));

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
      return alert(t("formationSelector.noPositionsAlert"));

    onAddFormation(scaledPlayers);
  };

  if (loading) return <div>Loading formations...</div>;
  if (error) return <div>Error loading formations: {error}</div>;

  return (
    <div className="formation-selector-container">
      <div className="formation-row">
        <label>{t("formationSelector.teamLabel")}</label>
        <select
          value={selectedTeamId}
          onChange={(e) =>
            setSelectedTeamId(Number(e.target.value) || undefined)
          }
        >
          <option value="">{t("formationSelector.noTeamOption")}</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="formation-row">
        <label>{t("formationSelector.formationLabel")}</label>
        <select
          value={selectedFormation}
          onChange={(e) => setSelectedFormation(e.target.value)}
        >
          <option value="">
            {t("formationSelector.selectFormationOption")}
          </option>
          {formations.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
        <button className="light-button" onClick={handleAddFormation}>
          {t("formationSelector.addFormation")}
        </button>
      </div>
    </div>
  );
};
