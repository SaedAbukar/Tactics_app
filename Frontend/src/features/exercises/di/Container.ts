import { UserDataApi } from "../api/UserDataApi";
import { ExercisesRepository } from "../repositories/ExercisesRepository";
import { ExercisesViewModel } from "../viewmodels/ExercisesViewModel";
// 1. Import the new ViewModel
import { TacticalBoardViewModel } from "../viewmodels/TacticalBoardViewModel";

// Define the request signature
type RequestFn = <T>(url: string, options?: RequestInit) => Promise<T>;

export class ExercisesContainer {
  private _exercisesViewModel: ExercisesViewModel;
  private _tacticalBoardViewModel: TacticalBoardViewModel;

  constructor(requestProxy: RequestFn) {
    const api = new UserDataApi(requestProxy);
    const repository = new ExercisesRepository(api);

    // Initialize the main Exercises VM
    this._exercisesViewModel = new ExercisesViewModel(repository);

    // 2. Initialize the Tactical Board VM
    // (It currently doesn't require a repo, but if it does later, you pass it here)
    this._tacticalBoardViewModel = new TacticalBoardViewModel();
  }

  get exercisesViewModel(): ExercisesViewModel {
    return this._exercisesViewModel;
  }

  // 3. Expose the getter
  get tacticalBoardViewModel(): TacticalBoardViewModel {
    return this._tacticalBoardViewModel;
  }
}
