import React, { useState, useEffect } from "react";
import type { Team } from "../../types/types";
import { useTranslation } from "react-i18next";
import "./FormationSelector.css";

interface Formation {
  name: string;
  teams: { team: Team; positions: { x: number; y: number }[] }[];
}

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

export const ApiFormationSelector: React.FC<FormationSelectorProps> = ({
  teams,
  pitchWidth,
  pitchHeight,
  currentPlayersCount,
  onAddFormation,
}) => {
  const { t } = useTranslation("tacticalEditor");
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
    undefined
  );
  const [selectedFormation, setSelectedFormation] = useState<string>("");

  useEffect(() => {
    const fetchFormations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No JWT token found");

        const res = await fetch("/api/formations", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok)
          throw new Error(`Failed to fetch formations: ${res.statusText}`);
        const data: Formation[] = await res.json();
        setFormations(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleAddFormation = () => {
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
