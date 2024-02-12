import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ICat } from "../../models/cat.model";
import { IApiParams, IMetaParams } from "../../models/api.model";

export const CatsActions = createActionGroup({
    source: 'Cats Components',
    events: {
        load: props<{ params: IMetaParams }>(),
        add: props<{ cat: ICat}>(),
        update: props<{ cat: ICat}>(),
        delete: props<{ id: string }>(),
    }
})

export const CatsActionsSuccess = createActionGroup({
    source: 'Cats Effects',
    events: {
        load: props<{ cats: ICat[], count: number }>(),
        add: props<{ cat: ICat }>(),
        update: props<{ cat: ICat }>(),
        delete: props<{ id: string }>(),
    }
})