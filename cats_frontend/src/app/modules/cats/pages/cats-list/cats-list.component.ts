import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { CatsService } from "../../services/cats.service";

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

    constructor(private catsService: CatsService) { }

    ngOnInit(): void {
        this.catsService.get().subscribe(cats => this.cats = cats);
    }
}