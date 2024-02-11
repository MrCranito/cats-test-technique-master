import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatsState, adapter, featureKey } from '../reducers/cats.reducer';
import { selectComments, selectCommentsState } from './comments.selectors';

export const selectCatsState =
  createFeatureSelector<CatsState>(featureKey);

export const getState = createSelector(selectCatsState, (state) => state);

export const {
  selectAll: selectCats,
} = adapter.getSelectors(getState);

export const selectCount = createSelector(  
    getState,
    (state) => state.count
);

export const selectCatWithComments = createSelector(
    selectCats,
    selectComments,
    (cats, comments) => {
        return cats.map(cat => {
            return {
                ...cat,
                comments: comments.filter(comment => comment.cat === cat.id)
            }
        });
    }
    
);