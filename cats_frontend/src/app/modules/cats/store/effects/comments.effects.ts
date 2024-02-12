import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommentsService } from "../../services/comments.service";
import { catchError, map, of, switchMap } from "rxjs";
import { CommentsActions, CommentsActionsSuccess } from "../actions/comments.actions";
import { IComment } from "../../models/comment.model";
import { MessageService } from "primeng/api";

@Injectable()
export class CommentsEffects {
    constructor(
        private actions$: Actions,
        private commentsService: CommentsService,
        private messageService: MessageService
    ) {}

    onLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.load),
            switchMap(({ id }) =>
                this.commentsService.get(id).pipe(
                    map((comments: IComment[]) =>
                        CommentsActionsSuccess.load({ comments }),
                    ),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on load' });
                        return of()
                    })
                ),
            ),
        ),
    );

    onAdd$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.add),
            switchMap(({ comment }) =>
                this.commentsService.create(comment).pipe(
                    map((comment: IComment) => {
                        this.messageService.add({ severity:'success', summary:'Success', detail: 'Comment added' });
                        return CommentsActionsSuccess.add({ comment })
                    }),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on added' });
                        return of()
                    }),
                ),
            ),
        ),
    );

    onUpdate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.update),
            switchMap(({ comment }) =>
                this.commentsService.update(comment).pipe(
                    map((comment: IComment) => {
                        this.messageService.add({ severity:'success', summary:'Success', detail: 'Comment updated' });
                        return CommentsActionsSuccess.update({ comment })
                    }),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on updated' });
                        return of()
                    }),
                ),
            ),
        ),
    );

    onDelete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.delete),
            switchMap(({ id }) =>
                this.commentsService.delete(id).pipe(
                    map(() => {
                        this.messageService.add({ severity:'success', summary:'Success', detail: 'Comment deleted' });
                        return CommentsActionsSuccess.delete({ id })
                    }),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on deleted' });
                        return of()
                    }),
                )
            ),
        )
    );
}