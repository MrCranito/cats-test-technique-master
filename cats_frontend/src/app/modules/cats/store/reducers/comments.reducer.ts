import { createReducer, on } from "@ngrx/store";
import { IComment } from "../../models/comment.model";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { commentsActions, commentsActionsSuccess } from "../actions/comments.actions";

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
    on(commentsActions.load, (state) => {
        return { ...state, loading: true };
    }),
    on(commentsActionsSuccess.load, (state, { comments }) => {
        return adapter.addMany(comments, { ...state, loading: false });
    }),
    on(commentsActionsSuccess.addComment, (state, { comment }) => {
        return adapter.addOne(comment, state);
    }),
    on(commentsActionsSuccess.deleteComment, (state, { id }) => {
        return adapter.removeOne(id, state);
    }),
);