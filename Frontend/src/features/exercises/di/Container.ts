import { UserDataApi } from "../api/UserDataApi";
import { UserSearchApi } from "../api/UserSearchApi";
import { ExercisesRepository } from "../repositories/ExercisesRepository";
import { UserSearchRepository } from "../repositories/UserSearchRepository";
import { ExercisesViewModel } from "../viewmodels/ExercisesViewModel";
// 1. Import the new ViewModel
import { TacticalBoardViewModel } from "../viewmodels/TacticalBoardViewModel";
import { UserSearchViewModel } from "../viewmodels/UserSearchViewModel";

// Define the request signature
type RequestFn = <T>(url: string, options?: RequestInit) => Promise<T>;

export class ExercisesContainer {
  private _exercisesViewModel: ExercisesViewModel;
  private _tacticalBoardViewModel: TacticalBoardViewModel;
  private _userSearchViewModel: UserSearchViewModel;

  constructor(requestProxy: RequestFn) {
    const api = new UserDataApi(requestProxy);
    const repository = new ExercisesRepository(api);
    this._exercisesViewModel = new ExercisesViewModel(repository);

    this._tacticalBoardViewModel = new TacticalBoardViewModel();

    const searchApi = new UserSearchApi(requestProxy);
    const searchRepo = new UserSearchRepository(searchApi);
    this._userSearchViewModel = new UserSearchViewModel(searchRepo);
  }

  get exercisesViewModel(): ExercisesViewModel {
    return this._exercisesViewModel;
  }

  get tacticalBoardViewModel(): TacticalBoardViewModel {
    return this._tacticalBoardViewModel;
  }

  get userSearchViewModel() {
    return this._userSearchViewModel;
  }
}
