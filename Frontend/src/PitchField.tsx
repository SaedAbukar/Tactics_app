import React from "react";

interface PitchFieldProps {
  width: number;
  height: number;
}

const PitchField: React.FC<PitchFieldProps> = ({ width, height }) => {
  // ===== Scaling constants =====
  const penaltyWidth = (width * 18) / 120; // 18-yard box width
  const penaltyDepth = (height * 18) / 80;
  const fiveYardWidth = (width * 5) / 120;
  const fiveYardDepth = (height * 5) / 80;

  const goalWidth = (width * 8) / 120;
  const goalDepth = (height * 2) / 80;

  const centerX = width / 2;
  const centerY = height / 2;
  const centerCircleRadius = (height * 10) / 80;

  // Penalty box positions
  const penaltyStartX = (width - penaltyWidth) / 2;
  const penaltyStartY = 0;

  const penaltyEndY = penaltyDepth;

  const fiveStartX = (width - fiveYardWidth) / 2;
  const fiveEndY = fiveYardDepth;

  // Goal positions
  const goalStartX = (width - goalWidth) / 2;
  const goalEndY = goalDepth;

  // Penalty arc
  const arcRadius = (height * 10) / 80;

  return (
    <>
      {/* Pitch Outline */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="white"
        strokeWidth={2}
      />

      {/* Center Line */}
      <line
        x1={0}
        y1={centerY}
        x2={width}
        y2={centerY}
        stroke="white"
        strokeWidth={2}
      />

      {/* Center Circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={centerCircleRadius}
        fill="none"
        stroke="white"
        strokeWidth={2}
      />

      {/* Top Penalty Box */}
      <path
        d={`
          M ${penaltyStartX} ${penaltyStartY}
          L ${penaltyStartX} ${penaltyEndY}
          L ${penaltyStartX + penaltyWidth} ${penaltyEndY}
          L ${penaltyStartX + penaltyWidth} ${penaltyStartY}
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Top Five-Yard Box */}
      <path
        d={`
          M ${fiveStartX} ${penaltyStartY}
          L ${fiveStartX} ${fiveEndY}
          L ${fiveStartX + fiveYardWidth} ${fiveEndY}
          L ${fiveStartX + fiveYardWidth} ${penaltyStartY}
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Top Goal */}
      <rect
        x={goalStartX}
        y={penaltyStartY - goalDepth}
        width={goalWidth}
        height={goalDepth}
        fill="none"
        stroke="white"
        strokeWidth={2}
      />

      {/* Top Penalty Arc */}
      <path
        d={`
          M ${centerX - arcRadius} ${penaltyEndY}
          A ${arcRadius} ${arcRadius} 0 0 1 ${
          centerX + arcRadius
        } ${penaltyEndY}
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Bottom Penalty Box */}
      <path
        d={`
          M ${penaltyStartX} ${height - penaltyEndY}
          L ${penaltyStartX} ${height - penaltyStartY}
          L ${penaltyStartX + penaltyWidth} ${height - penaltyStartY}
          L ${penaltyStartX + penaltyWidth} ${height - penaltyEndY}
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Bottom Five-Yard Box */}
      <path
        d={`
          M ${fiveStartX} ${height - fiveEndY}
          L ${fiveStartX} ${height - penaltyStartY}
          L ${fiveStartX + fiveYardWidth} ${height - penaltyStartY}
          L ${fiveStartX + fiveYardWidth} ${height - fiveEndY}
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Bottom Goal */}
      <rect
        x={goalStartX}
        y={height}
        width={goalWidth}
        height={goalDepth}
        fill="none"
        stroke="white"
        strokeWidth={2}
        transform={`translate(0, -${goalDepth})`}
      />

      {/* Bottom Penalty Arc */}
      <path
        d={`
          M ${centerX - arcRadius} ${height - penaltyEndY}
          A ${arcRadius} ${arcRadius} 0 0 0 ${centerX + arcRadius} ${
          height - penaltyEndY
        }
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />
    </>
  );
};

export default PitchField;
