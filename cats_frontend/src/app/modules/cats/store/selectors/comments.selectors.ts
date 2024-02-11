import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentsState, adapter, featureKey } from '../reducers/comments.reducer';

export const selectCommentsState =
  createFeatureSelector<CommentsState>(featureKey);

export const getState = createSelector(selectCommentsState, (state) => state);

export const {
  selectIds,
  selectEntities: selectLikesEntities,
  selectAll: selectLikes,
  selectTotal,
} = adapter.getSelectors(getState);

export const selectIsLoading = createSelector(
    getState,
    (state) => state.loading
);
