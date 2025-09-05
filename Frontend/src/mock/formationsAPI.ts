import type { Formation } from "../types/types";
import { formations as mockFormations } from "../components/formation_selector/formation";

// Simulate a fetch with delay
export async function fetchFormations(): Promise<Formation[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFormations);
    }, 100); // simulate network delay
  });
}
