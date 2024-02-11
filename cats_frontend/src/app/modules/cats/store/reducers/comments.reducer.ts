import { createReducer } from "@ngrx/store";
import { IComment } from "../../models/comment.model";
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export const featureKey = 'comments';

export interface CommentsState extends EntityState<IComment> {
  loading: boolean;
}

export const adapter = createEntityAdapter<IComment>();

export const initialState: CommentsState = adapter.getInitialState({
    loading: false,
});
  
export const commentsReducer = createReducer(
    initialState,
);