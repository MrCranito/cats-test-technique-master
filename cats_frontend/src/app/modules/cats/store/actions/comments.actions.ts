import { createActionGroup, props } from "@ngrx/store";
import { IComment } from "../../models/comment.model";

export const commentsActions = createActionGroup({
    source: 'Components',
    events: {
        load: props<{ params: any }>(),
        add: props<{ comment: IComment}>(),
        delete: props<{ id: string }>(),
    }
})

export const commentsActionsSuccess = createActionGroup({
    source: 'Effects',
    events: {
        load: props<{ comments: IComment[] }>(),
        addComment: props<{ comment: IComment }>(),
        deleteComment: props<{ id: string }>(),
    }
})