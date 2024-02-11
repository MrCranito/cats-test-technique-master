import { createActionGroup, props } from "@ngrx/store";
import { ICat } from "../../models/cat.model";

export const CatsActions = createActionGroup({
    source: 'Components',
    events: {
        load: props<{ params: any }>(),
        add: props<{ cat: ICat}>(),
        delete: props<{ id: string }>(),
    }
})

export const CatsActionsSuccess = createActionGroup({
    source: 'Effects',
    events: {
        load: props<{ cats: ICat[], count: number }>(),
        add: props<{ cat: ICat }>(),
        delete: props<{ id: string }>(),
    }
})