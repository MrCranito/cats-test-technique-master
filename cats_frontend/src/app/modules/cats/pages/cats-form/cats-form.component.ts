import { Component } from "@angular/core";
import { CatsService } from "../../services/cats.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ICat } from "../../models/cat.model";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

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
        private catsService: CatsService,
        private messageService: MessageService,
        private router: Router
    ) { }


    submit() {
        const cat: ICat = {
            name: this.form.get('name')?.value,
            breed: this.form.get('breed')?.value,
            birthday: this.form.get('birthday')?.value,
            description: this.form.get('description')?.value,
            comments: []
          };
          try {
            this.catsService.create(cat).subscribe(cat => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The cat is created' });
            });
          } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on creating the cat, please check the log' });
        }
    }

    goBackToList() {
        this.router.navigate(['cats']);
    }
}