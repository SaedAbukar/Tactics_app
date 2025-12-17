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
  width?: number; // Logical width (coordinate system)
  height?: number; // Logical height
}

export const Pitch: React.FC<PitchProps> = observer(
  ({ vm, width = 700, height = 900 }) => {
    const handleMouseMove = (
      e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
      if (!vm.dragItem) return;

      const svg = e.currentTarget;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;

      // getScreenCTM automatically handles the scaling calculation
      // so your logic remains correct even if the SVG shrinks
      const cursor = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      vm.moveDrag(cursor.x, cursor.y);
    };

    const handleMouseUp = () => {
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
        // 1. Define the coordinate system
        viewBox={`0 0 ${width} ${height}`}
        // 2. Allow CSS to control physical size (responsive)
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100%", // Ensure it fits in the flex container
          background: "var(--color-green, #0b6623)",
          marginTop: 10,
          borderRadius: "8px",
          boxShadow: "0 4px 6px var(--shadow-color)",
          cursor: vm.dragItem ? "grabbing" : "default",
          touchAction: "none",
        }}
        // 3. Preserve aspect ratio so players don't get squashed
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <PitchField width={width} height={height} />

        <Players
          players={vm.players}
          dragRef={proxyDragRef as any}
          setPlayers={() => {}}
        />
        <Balls
          balls={vm.balls}
          dragRef={proxyDragRef as any}
          setBalls={() => {}}
        />
        <GoalComponent
          goals={vm.goals}
          dragRef={proxyDragRef as any}
          setGoals={() => {}}
        />
        <ConeComponent
          cones={vm.cones}
          dragRef={proxyDragRef as any}
          setCones={() => {}}
        />
      </svg>
    );
  }
);
