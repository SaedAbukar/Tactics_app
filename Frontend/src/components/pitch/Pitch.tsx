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
      e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
      if (!vm.dragItem) return;

      const svg = e.currentTarget;
      const screenCTM = svg.getScreenCTM();

      // Safety check: ensure CTM exists before using it
      if (!screenCTM) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;

      const cursor = pt.matrixTransform(screenCTM.inverse());

      vm.moveDrag(cursor.x, cursor.y);
    };

    const handleMouseUp = () => {
      vm.stopDrag();
    };

    // --- TOUCH HANDLERS (Mobile) ---
    const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
      if (!vm.dragItem) return;

      const svg = e.currentTarget;
      const screenCTM = svg.getScreenCTM();

      // Safety check: ensure CTM exists before using it
      if (!screenCTM) return;

      const touch = e.touches[0]; // Get the first touch finger
      const pt = svg.createSVGPoint();
      pt.x = touch.clientX;
      pt.y = touch.clientY;

      const cursor = pt.matrixTransform(screenCTM.inverse());

      vm.moveDrag(cursor.x, cursor.y);
    };

    const handleTouchEnd = () => {
      vm.stopDrag();
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
        // Mobile Listeners
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <PitchField width={width} height={height} />

        <Players
          players={vm.players}
          dragRef={proxyDragRef as any}
          setPlayers={() => {}}
          selectedItem={vm.dragItem}
        />
        <Balls
          balls={vm.balls}
          dragRef={proxyDragRef as any}
          setBalls={() => {}}
          selectedItem={vm.dragItem}
        />
        <GoalComponent
          goals={vm.goals}
          dragRef={proxyDragRef as any}
          setGoals={() => {}}
          selectedItem={vm.dragItem}
        />
        <ConeComponent
          cones={vm.cones}
          dragRef={proxyDragRef as any}
          setCones={() => {}}
          selectedItem={vm.dragItem}
        />
      </svg>
    );
  }
);
