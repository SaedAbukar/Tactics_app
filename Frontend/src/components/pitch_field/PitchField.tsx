import React from "react";

interface PitchFieldProps {
  width: number;
  height: number;
}

const PitchField: React.FC<PitchFieldProps> = ({ width, height }) => {
  // ===== Scaling constants =====
  const penaltyWidth = (width * 70) / 120; // 18-yard box width
  const penaltyDepth = (height * 16) / 80;
  const fiveYardWidth = (width * 40) / 120;
  const fiveYardDepth = (height * 5) / 80;

  const centerX = width / 2;
  const centerY = height / 2;
  const centerCircleRadius = (height * 10) / 80;

  // Penalty box positions
  const penaltyStartX = (width - penaltyWidth) / 2;
  const penaltyStartY = 0;

  const penaltyEndY = penaltyDepth;

  const fiveStartX = (width - fiveYardWidth) / 2;
  const fiveEndY = fiveYardDepth;

  // Penalty spot positions
  const penaltySpotDistance = (height * 10) / 80; // scale 12 yards to your height
  const penaltySpotRadius = 4; // small circle

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
      {/* Top Penalty Spot*/}
      <circle
        cx={centerX}
        cy={penaltySpotDistance}
        r={penaltySpotRadius}
        fill="white"
      />
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
        cy={height - penaltySpotDistance}
        r={penaltySpotRadius}
        fill="white"
      />
    </>
  );
};

export default PitchField;
