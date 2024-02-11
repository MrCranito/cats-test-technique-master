import { createReducer, on } from "@ngrx/store";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ICat } from "../../models/cat.model";
import { CatsActions, CatsActionsSuccess } from "../actions/cats.actions";

export const featureKey = 'cats';

export interface CatsState extends EntityState<ICat> {
  loading: boolean;
  count: number;
}

export const adapter = createEntityAdapter<ICat>();

export const initialState: CatsState = adapter.getInitialState({
    loading: false,
    count: 0,
});
  
export const catsReducer = createReducer(
    initialState,
    on(CatsActions.load, (state) =>  ({ ...state, loading: true })),
    on(CatsActionsSuccess.load, (state,  { cats, count }) => {
        const newState = adapter.removeAll(state);
        return adapter.addMany(cats, { ...newState, count,  loading: false });
    }),
    on(CatsActionsSuccess.add, (state, { cat }) => {
        return adapter.addOne(cat, state);
    }),
    on(CatsActionsSuccess.update, (state, { cat }) => {
        return adapter.updateOne({ id: cat.id!, changes: cat }, state);
    }),
    on(CatsActionsSuccess.delete, (state, { id }) => {
        return adapter.removeOne(id, state);
    }),
);