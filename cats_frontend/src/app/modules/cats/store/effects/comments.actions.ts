import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommentsService } from "../../services/comments.service";
import { map, switchMap } from "rxjs";
import { CommentsActions, CommentsActionsSuccess } from "../actions/comments.actions";
import { IComment } from "../../models/comment.model";

@Injectable()
export class CommentsEffects {
    constructor(
        private actions$: Actions,
        private commentsService: CommentsService
    ) {}

    onLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.load),
            switchMap(({ id }) =>
                this.commentsService.get(id).pipe(
                    map((comments: IComment[]) =>
                        CommentsActionsSuccess.load({ comments }),
                    ),
                ),
            ),
        ),
    );

    onAdd$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.add),
            switchMap(({ comment }) =>
                this.commentsService.create(comment).pipe(
                    map((comment: IComment) =>
                        CommentsActionsSuccess.add({ comment }),
                    ),
                ),
            ),
        ),
    );

    onDelete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.delete),
            switchMap(({ id }) =>
                this.commentsService.delete(id).pipe(
                    map(() =>
                        CommentsActionsSuccess.delete({ id }),
                    ),
                ),
            ),
        ),
    );
}