import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { CatsService } from "../../services/cats.service";
import { Router } from "@angular/router";
import { CommentsService } from "../../services/comments.service";
import { IComment } from "../../models/comment.model";

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
        private commentsService: CommentsService,
        private router: Router
        ) { }

    ngOnInit(): void {
        this.catsService.get().subscribe((cats: ICat[]) => {
            this.cats = cats;
        });

        this.commentsService.get().subscribe((comments: IComment[]) => {
            for(let comment of comments) {
              for(let cat of this.cats) {
                if(cat.id === comment.cat) {
                  cat.comments = cat.comments ? [...cat.comments, comment] : [comment];
                }
              }
            }
        })
    }

    goToCreate(): void {
        this.router.navigate(['cats/create']);
    }
}