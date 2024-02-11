import { createReducer, on } from "@ngrx/store";
import { IComment } from "../../models/comment.model";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CommentsActions, CommentsActionsSuccess } from "../actions/comments.actions";

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
    on(CommentsActions.load, (state) => {
        return { ...state, loading: true };
    }),
    on(CommentsActionsSuccess.load, (state, { comments }) => {
        return adapter.addMany(comments, { ...state, loading: false });
    }),
    on(CommentsActionsSuccess.add, (state, { comment }) => {
        return adapter.addOne(comment, state);
    }),
    on(CommentsActionsSuccess.delete, (state, { id }) => {
        return adapter.removeOne(id, state);
    }),
);