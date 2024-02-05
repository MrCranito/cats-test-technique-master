import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { CatsService } from "../../services/cats.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommentsService } from "../../services/comments.service";
import { IComment } from "../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { CreateCommentComponent } from "../../components/modals/create-comment/create-comment.component";
import { EditCommentComponent } from "../../components/modals/edit-comment/edit-comment.component";
import { Subscription, debounceTime, distinctUntilChanged } from "rxjs";

@Component({
    selector: 'app-cats-list',
    templateUrl: './cats-list.component.html'
})
export class CatsListComponent implements OnInit {

    cats: ICat[] = [];
    count: number = 0;
    cols: { field: string, header: string }[] = [
        { field: 'name', header: 'Name' },
        { field: 'breed', header: 'Breed' },
        { field: 'birthday', header: 'Birthday' },
        { field: 'description', header: 'Description' }
    ]

    editSidebarIsOpened: boolean = false;
    createCommentModalIsOpened: boolean = false;
    editCommentModalIsOpened: boolean = false;

    selectedCat: ICat | null = null;
    searchText: FormControl = new FormControl('');
    searchSubscription: Subscription | null = null;

    first: number = 0;
    rows: number = 10;
    sortField: string = '';
    sortOrder: number = 1;


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
        private dialogService: DialogService,
        private router: Router,
        private route: ActivatedRoute
        ) { }

    ngOnInit(): void {
        this.catsService.get().subscribe((data: { cats: ICat[], count: number}) => {
            this.cats = data.cats;
            this.count = data.count;
        });

        this.searchSubscription = 
            this.searchText.valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged()
            ).subscribe((_) => {
                this.searchSubscription?.add(this.catsService.get(
                    this.first / this.rows + 1,
                    this.searchText.value,
                    this.sortField
                ).subscribe((data: { cats: ICat[], count: number}) => {
                    this.cats = data.cats;
                    this.count = data.count;
                    this.first = 0;
                }));
            })
    }

    loadCat($event: any) {
        this.first = $event.first;
        this.sortField = $event.sortField;
        this.sortOrder = $event.sortOrder;

        this.catsService.get(
            this.first / this.rows + 1,
            this.searchText.value,
            this.sortOrder == -1 ? '-' + this.sortField : this.sortField
        ).subscribe((data: { cats: ICat[], count: number}) => {
            this.cats = data.cats;
            this.count = data.count;
            this.first = $event.first;
        });
        this.updateQueryParam();
    }

    expandCat(cat: ICat) {
        this.commentsService.get(cat.id!).subscribe((comments: IComment[]) => {
            cat.comments = comments;
        });
    }

    private updateQueryParam() {
        if(this.first === 0) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: null},
            queryParamsHandling: 'merge',
          });
        } else {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.first / this.rows + 1 },
            queryParamsHandling: 'merge',
          });
        }
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
       const dialogRef = this.dialogService.open(CreateCommentComponent, {
        data: {
            cat: cat
        }
       })

        dialogRef.onClose.subscribe((comment: IComment) => {
            for(let c of this.cats) {
                if(c.id === cat.id) {
                    c.comments = c.comments ? [...c.comments, comment] : [comment];
                }
            }

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The comment is created' });
        })
    }

    startCommentEdit(comment: IComment, cat: ICat): void {
        const dialogRef = this.dialogService.open(EditCommentComponent, {
            data: {
                comment: comment
            }
        })

        dialogRef.onClose.subscribe((comment: IComment) => {
            for(let c of this.cats) {
                if(c.id === cat.id) {
                    c.comments = c.comments?.map((c) => c.id === comment.id ? comment : c);
                }
            }

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The comment is updated' });
        })
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