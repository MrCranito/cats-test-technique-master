import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatsState, adapter, featureKey } from '../reducers/cats.reducer';

export const selectCatsState =
  createFeatureSelector<CatsState>(featureKey);

export const getState = createSelector(selectCatsState, (state) => state);

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
