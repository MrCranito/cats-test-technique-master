import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ICat } from "../../models/cat.model";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { CatsActions } from "../../store/actions/cats.actions";

@Component({
    selector: 'app-cats-form',
    templateUrl: './cats-form.component.html'
})

export class CatsFormComponent {

    form: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        breed: new FormControl('', [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
    });

    constructor(
        private router: Router,
        private datePipe: DatePipe,
        private store: Store,
    ) { }

    submit(): void {
        const cat: ICat = {
            name: this.form.get('name')?.value,
            breed: this.form.get('breed')?.value,
            birthday: this.datePipe.transform(this.form.get('birthday')?.value, 'YYYY-MM-dd')!,
            description: this.form.get('description')?.value,
        };
         
        // dispatch action
        this.store.dispatch(CatsActions.add({ cat }));

        // reset form after dispatch
        this.form.reset();
    }

    goBackToList(): void {
        this.router.navigate(['cats']);
    }
}