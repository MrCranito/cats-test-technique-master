import { createActionGroup, props } from "@ngrx/store";
import { ICat } from "../../models/cat.model";

export const catsActions = createActionGroup({
    source: 'Components',
    events: {
        load: props<{ params: any }>(),
        add: props<{ cat: ICat}>(),
        delete: props<{ id: string }>(),
    }
})

export const catsActionsSuccess = createActionGroup({
    source: 'Effects',
    events: {
        load: props<{ cats: ICat[] }>(),
        add: props<{ cat: ICat }>(),
        delete: props<{ id: string }>(),
    }
})