import { createReducer } from "@ngrx/store";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ICat } from "../../models/cat.model";

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
);