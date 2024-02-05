import { Component } from "@angular/core";
import { CatsService } from "../../services/cats.service";

@Component({
    selector: 'app-cats-form',
    templateUrl: './cats-form.component.html'
})

export class CatsFormComponent {
    constructor(private catsService: CatsService) { }
}