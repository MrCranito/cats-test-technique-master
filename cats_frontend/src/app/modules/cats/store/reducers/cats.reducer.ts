import { createReducer, on } from "@ngrx/store";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ICat } from "../../models/cat.model";
import { catsActions, catsActionsSuccess } from "../actions/cats.actions";

export const featureKey = 'cats';

export interface CatsState extends EntityState<ICat> {
  loading: boolean;
}

export const adapter = createEntityAdapter<ICat>();

export const initialState: CatsState = adapter.getInitialState({
    loading: false,
});
  
export const catsReducer = createReducer(
    initialState,
    on(catsActions.load, (state) => {
        return { ...state, loading: true };
    }),
    on(catsActionsSuccess.load, (state,  { cats }) => {
        return adapter.addMany(cats, { ...state, loading: false });
    }),
    on(catsActionsSuccess.add, (state, { cat }) => {
        return adapter.addOne(cat, state);
    }),
    on(catsActionsSuccess.delete, (state, { id }) => {
        return adapter.removeOne(id, state);
    }),
);