import { Injectable } from "@angular/core";
import { CatsService } from "../../services/cats.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CatsActions, CatsActionsSuccess } from "../actions/cats.actions";
import { catchError, map, switchMap } from "rxjs";
import { ICat } from "../../models/cat.model";
import { MessageService } from "primeng/api";

@Injectable()
export class CatsEffects {
    constructor(
        private actions$: Actions,
        private catsService: CatsService,
        private messageService: MessageService
        ) {}

    onLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CatsActions.load),
            switchMap(() =>
                this.catsService.get().pipe(
                    map((result: { cats: ICat[], count: number }) => 
                         CatsActionsSuccess.load({
                            cats: result.cats,
                            count: result.count,
                        })
                    ),
                ),
            ),
        ),
    );
    
    onAdd$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CatsActions.add),
            switchMap(({ cat }) =>
                this.catsService.create(cat).pipe(
                    map((result: ICat) => {
                        this.messageService.add({ severity:'success', summary:'Success', detail: 'Cat added'});
                        return CatsActionsSuccess.add({ cat: result })
                    }),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on added' });
                        return [];
                    }),
                )
            ),
        )
    );

    onUpdate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CatsActions.update),
            switchMap(({ cat }) =>
                this.catsService.update(cat).pipe(
                    map((result: ICat) => {
                        this.messageService.add({ severity:'success', summary:'Success', detail: 'Cat updated' });
                        return CatsActionsSuccess.update({ cat: result })
                    }),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on updated' });
                        return [];
                    })
                ),
            ),
        ),
    );

    onDelete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CatsActions.delete),
            switchMap(({ id }) =>
                this.catsService.delete(id).pipe(
                    map(() => {
                        this.messageService.add({ severity:'success', summary:'Success', detail: 'Cat deleted' });
                        return CatsActionsSuccess.delete({ id })
                    }),
                    catchError(() => {
                        this.messageService.add({ severity:'error', summary:'Error', detail: 'Something wrong happened on deleted' });
                        return [];
                    })
                ),
            ),
        ),
    );

}