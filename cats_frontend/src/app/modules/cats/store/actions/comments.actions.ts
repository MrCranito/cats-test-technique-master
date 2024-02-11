import { createActionGroup, props } from "@ngrx/store";
import { IComment } from "../../models/comment.model";

export const CommentsActions = createActionGroup({
    source: 'Comments Components',
    events: {
        load: props<{ id: string }>(),
        update: props<{ comment: IComment}>(),
        add: props<{ comment: IComment}>(),
        delete: props<{ id: string }>(),
    }
})

export const CommentsActionsSuccess = createActionGroup({
    source: 'Comments Effects',
    events: {
        load: props<{ comments: IComment[] }>(),
        update: props<{ comment: IComment }>(),
        add: props<{ comment: IComment }>(),
        delete: props<{ id: string }>(),
    }
})