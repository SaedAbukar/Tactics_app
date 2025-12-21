// import React, { useState, useEffect } from "react";
// import type { Team } from "../../types/types";
// import { useTranslation } from "react-i18next";
// import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
// import "./FormationSelector.css";

// interface Formation {
//   name: string;
//   teams: { team: Team; positions: { x: number; y: number }[] }[];
// }

// interface FormationSelectorProps {
//   teams: Team[];
//   pitchWidth: number;
//   pitchHeight: number;
//   currentPlayersCount: number;
//   onAddFormation: (scaledPlayers: any[]) => void;
// }

// // ID generator for numeric IDs
// let lastTime = 0;
// let counter = 0;
// function generateId(): number {
//   const now = Date.now();
//   if (now === lastTime) counter++;
//   else {
//     lastTime = now;
//     counter = 0;
//   }
//   return now * 1000 + counter;
// }

// let playerNumber = 1;

// export const FormationSelector: React.FC<FormationSelectorProps> = ({
//   teams,
//   pitchWidth,
//   pitchHeight,
//   currentPlayersCount,
//   onAddFormation,
// }) => {
//   const { t } = useTranslation("tacticalEditor");
//   const { request } = useFetchWithAuth();

//   const [formations, setFormations] = useState<Formation[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
//     undefined
//   );
//   const [selectedFormation, setSelectedFormation] = useState<string>("");
//   const [newFormationName, setNewFormationName] = useState<string>("");

//   // useEffect(() => {
//   //   const fetchFormations = async () => {
//   //     setLoading(true);
//   //     setError(null);
//   //     try {
//   //       const data: Formation[] = await request("/formations");
//   //       setFormations(data);
//   //     } catch (err: any) {
//   //       console.error("Failed to fetch formations:", err);
//   //       setFormations([]);
//   //       setError("Failed to load formations. You can still add manually.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchFormations();
//   // }, [request]);

//   const handleAddFormation = () => {
//     const teamObj = teams.find((t) => t.id === selectedTeamId);
//     const defaultColor = "white";

//     let scaledPlayers: any[] = [];

//     // If a formation is selected, scale its players
//     const formation = formations.find((f) => f.name === selectedFormation);
//     if (formation) {
//       scaledPlayers = formation.teams.flatMap(() =>
//         formation.teams[0].positions.map((pos) => {
//           let x = pos.x * pitchWidth;
//           let y = pos.y * pitchHeight;

//           if (currentPlayersCount > 0) y = pitchHeight - y - 50;

//           return {
//             id: generateId(),
//             number: playerNumber++,
//             x,
//             y,
//             color: teamObj?.color || defaultColor,
//             teamId: selectedTeamId,
//           };
//         })
//       );
//     }

//     onAddFormation(scaledPlayers);

//     // If user gave a new formation name, save it locally
//     if (newFormationName.trim()) {
//       const newFormation: Formation = {
//         name: newFormationName.trim(),
//         teams: [], // initially empty
//       };
//       setFormations((prev) => [...prev, newFormation]);
//       setSelectedFormation(newFormation.name);
//       setNewFormationName("");
//     }
//   };

//   return (
//     <div className="formation-selector-container">
//       <div className="formation-row">
//         <label>{t("formationSelector.teamLabel")}</label>
//         <select
//           value={selectedTeamId}
//           onChange={(e) =>
//             setSelectedTeamId(Number(e.target.value) || undefined)
//           }
//         >
//           <option value="">{t("formationSelector.noTeamOption")}</option>
//           {teams.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="formation-row">
//         <label>{t("formationSelector.formationLabel")}</label>
//         <select
//           value={selectedFormation}
//           onChange={(e) => setSelectedFormation(e.target.value)}
//         >
//           <option value="">
//             {t("formationSelector.selectFormationOption")}
//           </option>
//           {formations.map((f) => (
//             <option key={f.name} value={f.name}>
//               {f.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="formation-row">
//         <label>New Formation Name:</label>
//         <input
//           type="text"
//           value={newFormationName}
//           onChange={(e) => setNewFormationName(e.target.value)}
//           placeholder="Enter formation name"
//         />
//       </div>

//       <div className="formation-row">
//         <button className="light-button" onClick={handleAddFormation}>
//           {t("formationSelector.addFormation")}
//         </button>
//       </div>

//       {loading && <div>Loading formations...</div>}
//       {error && <div className="error">{error}</div>}
//       {!loading && formations.length === 0 && !error && (
//         <div>No formations available. You can start manually.</div>
//       )}
//     </div>
//   );
// };
