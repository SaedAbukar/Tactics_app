import React from "react";

interface PitchFieldProps {
  width: number;
  height: number;
}

const PitchField: React.FC<PitchFieldProps> = ({ width, height }) => {
  // Padding to prevent border clipping (strokeWidth / 2 + safe margin)
  const inset = 4;
  const safeWidth = width - inset * 2;
  const safeHeight = height - inset * 2;

  // ===== Scaling constants =====
  // Use safeWidth/safeHeight for calculations to keep proportions inside the border
  const penaltyWidth = (safeWidth * 70) / 120;
  const penaltyDepth = (safeHeight * 16) / 80;
  const fiveYardWidth = (safeWidth * 40) / 120;
  const fiveYardDepth = (safeHeight * 5) / 80;

  const centerX = width / 2;
  const centerY = height / 2;
  const centerCircleRadius = (safeHeight * 10) / 80;

  // Penalty box positions
  const penaltyStartX = (width - penaltyWidth) / 2;
  const penaltyStartY = inset;

  const penaltyEndY = penaltyDepth + inset;

  const fiveStartX = (width - fiveYardWidth) / 2;
  const fiveEndY = fiveYardDepth + inset;

  // Penalty spot positions
  const penaltySpotDistance = (safeHeight * 10) / 80;
  const penaltySpotRadius = 4;

  return (
    <>
      {/* Pitch Outline (Inset to prevent clipping) */}
      <rect
        x={inset}
        y={inset}
        width={safeWidth}
        height={safeHeight}
        fill="none"
        stroke="white"
        strokeWidth={2}
      />
      {/* Center Line */}
      <line
        x1={inset}
        y1={centerY}
        x2={width - inset}
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

      {/* --- TOP HALF --- */}

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
      {/* Top Penalty Spot */}
      <circle
        cx={centerX}
        cy={inset + penaltySpotDistance}
        r={penaltySpotRadius}
        fill="white"
      />

      {/* --- BOTTOM HALF --- */}

      {/* Bottom Penalty Box */}
      <path
        d={`
          M ${penaltyStartX} ${height - penaltyEndY}
          L ${penaltyStartX} ${height - penaltyStartY}
          L ${penaltyStartX + penaltyWidth} ${height - penaltyStartY}
          L ${penaltyStartX + penaltyWidth} ${height - penaltyEndY}
          Z
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
          Z
        `}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />
      {/* Bottom Penalty Spot */}
      <circle
        cx={centerX}
        cy={height - (inset + penaltySpotDistance)}
        r={penaltySpotRadius}
        fill="white"
      />
    </>
  );
};

export default PitchField;
