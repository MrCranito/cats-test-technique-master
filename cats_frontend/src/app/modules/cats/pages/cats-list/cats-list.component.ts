import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { CatsService } from "../../services/cats.service";
import { Router } from "@angular/router";
import { CommentsService } from "../../services/comments.service";
import { IComment } from "../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";

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

    editSidebarIsOpened: boolean = false;
    createCommentModalIsOpened: boolean = false;
    editCommentModalIsOpened: boolean = false;

    selectedCat: ICat | null = null;


    // forms
    editCatForm: FormGroup = new FormGroup({
        id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        breed: new FormControl('', [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
      });

    constructor(
        private catsService: CatsService,
        private commentsService: CommentsService,
        private messageService: MessageService,
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

    startCatEdit(cat: ICat): void {
        this.editCatForm.setValue({
            id: cat.id,
            name: cat.name,
            breed: cat.breed,
            birthday: cat.birthday,
            description: cat.description
          });
      
        this.editSidebarIsOpened = true;
    }


    cancelCatEdit() { 
        this.editSidebarIsOpened = false;
    }

    startCommentCreate(cat: ICat): void {

    }

    startCommentEdit(comment: IComment, cat: ICat): void {

    }


    updateCat(): void {
        const cat: ICat = {
            id: this.editCatForm.get('id')?.value,
            name: this.editCatForm.get('name')?.value,
            breed: this.editCatForm.get('breed')?.value,
            birthday: this.editCatForm.get('birthday')?.value,
            description: this.editCatForm.get('description')?.value,
          };
      
          this.catsService.update(cat).subscribe(cat => {
            this.cats = this.cats.map(c => c.name === cat.name ? cat : c);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The cat is updated' });
          });
      
          this.editSidebarIsOpened = false;
    }

    closeSidebar(): void {
        this.editSidebarIsOpened = false;
    }
}