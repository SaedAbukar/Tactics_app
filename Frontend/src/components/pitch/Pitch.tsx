import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import PitchField from "../pitch_field/PitchField";
import Players from "../player/Player";
import Balls from "../ball/Ball";
import GoalComponent from "../goal/Goal";
import ConeComponent from "../cone/Cone";
import { TacticalBoardViewModel } from "../../features/exercises/viewmodels/TacticalBoardViewModel";

interface PitchProps {
  vm: TacticalBoardViewModel;
  width?: number;
  height?: number;
}

export const Pitch: React.FC<PitchProps> = observer(
  ({ vm, width = 700, height = 900 }) => {
    // --- MOUSE HANDLERS (Desktop) ---
    const handleMouseMove = (
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    ) => {
      if (!vm.dragItem) return;

      const svg = e.currentTarget;
      const screenCTM = svg.getScreenCTM();
      if (!screenCTM) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;

      const cursor = pt.matrixTransform(screenCTM.inverse());

      // Pass e.shiftKey for 45-degree angle snapping during rotation
      vm.moveDrag(cursor.x, cursor.y, e.shiftKey);
    };

    const handleMouseUp = () => {
      vm.stopDrag();
    };

    // --- TOUCH HANDLERS (Mobile) ---
    const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
      if (!vm.dragItem) return;

      const svg = e.currentTarget;
      const screenCTM = svg.getScreenCTM();
      if (!screenCTM) return;

      const touch = e.touches[0];
      const pt = svg.createSVGPoint();
      pt.x = touch.clientX;
      pt.y = touch.clientY;

      const cursor = pt.matrixTransform(screenCTM.inverse());

      // Mobile defaults to false (no shift key available)
      vm.moveDrag(cursor.x, cursor.y, false);
    };

    const handleTouchEnd = () => {
      vm.stopDrag();
    };

    // --- BACKGROUND CLICK (Clear Selection) ---
    const handleBackgroundClick = (e: React.MouseEvent | React.TouchEvent) => {
      // Only clear selection if we actually clicked the empty pitch grass,
      // not if we clicked a player/goal (which stop propagation)
      if (e.target === e.currentTarget) {
        if (vm.clearSelection) vm.clearSelection();
      }
    };

    const proxyDragRef = useMemo(() => {
      return {
        get current() {
          return vm.dragItem;
        },
        set current(val: any) {
          if (val) vm.startDrag(val);
          else vm.stopDrag();
        },
      };
    }, [vm]);

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          display: "block",
          margin: "0 auto",
          background: "var(--color-green, #0b6623)",
          borderRadius: "8px",
          boxShadow: "0 4px 6px var(--shadow-color)",
          cursor: vm.dragItem ? "grabbing" : "default",
          touchAction: "none", // CRITICAL for mobile performance
        }}
        preserveAspectRatio="xMidYMid meet"
        // Desktop Listeners
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleBackgroundClick}
        // Mobile Listeners
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onTouchStart={handleBackgroundClick}
      >
        <PitchField width={width} height={height} />

        {/* Note: Passing vm.selectedItem instead of vm.dragItem to all components */}
        <Players
          players={vm.players}
          dragRef={proxyDragRef as any}
          setPlayers={() => {}}
          selectedItem={vm.selectedItem}
        />
        <Balls
          balls={vm.balls}
          dragRef={proxyDragRef as any}
          setBalls={() => {}}
          selectedItem={vm.selectedItem}
        />
        <GoalComponent
          goals={vm.goals}
          dragRef={proxyDragRef as any}
          setGoals={() => {}}
          selectedItem={vm.selectedItem}
        />
        <ConeComponent
          cones={vm.cones}
          dragRef={proxyDragRef as any}
          setCones={() => {}}
          selectedItem={vm.selectedItem}
        />
      </svg>
    );
  },
);
