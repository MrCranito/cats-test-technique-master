import { ActionReducerMap } from "@ngrx/store";
import { CatsState, catsReducer } from "./cats.reducer";
import { CommentsState, commentsReducer } from "./comments.reducer";

export interface AppState {
    cats: CatsState;
    comments: CommentsState;
}

export const reducers: ActionReducerMap<AppState> = {
    cats: catsReducer,
    comments: commentsReducer,
}