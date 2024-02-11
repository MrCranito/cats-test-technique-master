import { Injectable } from "@angular/core";
import { CatsService } from "../../services/cats.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CatsActions, CatsActionsSuccess } from "../actions/cats.actions";
import { map, switchMap } from "rxjs";
import { ICat } from "../../models/cat.model";

@Injectable()
export class CatsEffects {
    constructor(
        private actions$: Actions,
        private catsService: CatsService) {}

    onLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CatsActions.load),
            switchMap(() =>
                this.catsService.get().pipe(
                    map((result: { cats: ICat[], count: number }) =>
                        CatsActionsSuccess.load({
                            cats: result.cats,
                            count: result.count,
                        }),
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
                    map((result: ICat) =>
                        CatsActionsSuccess.add({ cat: result }),
                    ),
                ),
            ),
        ),
    );

    onDelete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CatsActions.delete),
            switchMap(({ id }) =>
                this.catsService.delete(id).pipe(
                    map(() =>
                        CatsActionsSuccess.delete({ id }),
                    ),
                ),
            ),
        ),
    );

}