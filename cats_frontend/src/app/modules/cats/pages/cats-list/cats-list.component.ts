import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { CatsService } from "../../services/cats.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-cats-list',
    templateUrl: './cats-list.component.html'
})
export class CatsListComponent implements OnInit {

    cats: ICat[] = [];
    cols: { field: string, header: string }[] = [
        { field: 'name', header: 'Name' },
        { field: 'breed', header: 'Breed' },
        { field: 'birthday', header: 'Birthday' },
        { field: 'description', header: 'Description' }
    ]
    search: string = '';

    constructor(
        private catsService: CatsService,
        private router: Router
        ) { }

    ngOnInit(): void {
        this.catsService.get().subscribe((cats: ICat[]) => {
            this.cats = cats;
        });
    }

    goToCreate(): void {
        this.router.navigate(['/create']);
    }
}