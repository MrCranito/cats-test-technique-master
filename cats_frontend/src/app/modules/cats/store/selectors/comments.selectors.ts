import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentsState, adapter, featureKey } from '../reducers/comments.reducer';

export const selectCommentsState =
  createFeatureSelector<CommentsState>(featureKey);

export const getState = createSelector(selectCommentsState, (state) => state);

export const {
  selectAll: selectComments,
} = adapter.getSelectors(getState);
