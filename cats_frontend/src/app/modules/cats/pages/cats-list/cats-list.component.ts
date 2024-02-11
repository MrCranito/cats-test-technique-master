import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { CatsService } from "../../services/cats.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommentsService } from "../../services/comments.service";
import { IComment } from "../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FilterMatchMode, MessageService, SelectItem } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { CreateCommentComponent } from "../../components/modals/create-comment/create-comment.component";
import { EditCommentComponent } from "../../components/modals/edit-comment/edit-comment.component";
import { Subscription, debounceTime, distinctUntilChanged } from "rxjs";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-cats-list',
    templateUrl: './cats-list.component.html'
})
export class CatsListComponent implements OnInit {

    // booleans
    editSidebarIsOpened: boolean = false;
    createCommentModalIsOpened: boolean = false;
    editCommentModalIsOpened: boolean = false;

    // expanded
    selectedCat: ICat | null = null;
    
    // table options
    cats: ICat[] = [];
    cols: { field: string, header: string }[] = [
        { field: 'name', header: 'Name' },
        { field: 'breed', header: 'Breed' },
        { field: 'birthday', header: 'Birthday' },
        { field: 'description', header: 'Description' }
    ]
    matchFiltersModeOptionsText: { label: string, value: string }[] =  [
        { label: 'Contains', value: FilterMatchMode.CONTAINS },
        { label: 'In', value: FilterMatchMode.IN },
    ]
    matchFiltersModeOptionsNumber: SelectItem[] =  [
        { label: 'Greater than', value: FilterMatchMode.GREATER_THAN },
        { label: 'Less than', value: FilterMatchMode.LESS_THAN },
    ]
    
    count: number = 0;
    first: number = 0;
    rows: number = 10;
    sortField: string = '';
    sortOrder: number = 1;
    searchText: FormControl = new FormControl('');
    searchSubscription: Subscription | null = null;

    // forms
    editCatForm: FormGroup = new FormGroup({
        id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        breed: new FormControl(new Date(), [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
    });

    constructor(
        private catsService: CatsService,
        private commentsService: CommentsService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe
        ) { }

    ngOnInit(): void {
        this.catsService.get().subscribe((data: { cats: ICat[], count: number}) => {
            this.cats = data.cats;
            this.count = data.count;
        });

        // search from name input
        // debounce 300ms before sending the request
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

    // lazy load call
    // each filters and sorting event 
    // will trigger this function
    loadCat($event: any) {

        const filters = $event.filters;

        this.first = $event.first;
        this.sortField = $event.sortField;
        this.sortOrder = $event.sortOrder;

        this.catsService.get(
            this.first / this.rows + 1,
            this.searchText.value,
            this.sortOrder == -1 ? '-' + this.sortField : this.sortField,
            filters
        ).subscribe((data: { cats: ICat[], count: number}) => {
            this.cats = data.cats;
            this.count = data.count;
            this.first = $event.first;
        });
        this.updateQueryParam();
    }

    // called on the expand of the row
    expandCat(cat: ICat) {
        this.commentsService.get(cat.id!).subscribe((comments: IComment[]) => {
            cat.comments = comments;
        });
    }

    // add or remove query param of the page
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

    deleteCat(cat: ICat): void {
        this.catsService.delete(cat.id!).subscribe(() => {
            this.cats = this.cats.filter(c => c.id !== cat.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The cat is deleted' });
        });
    }

    startCatEdit(cat: ICat): void {
        this.editCatForm.setValue({
            id: cat.id,
            name: cat.name,
            breed: cat.breed,
            birthday: new Date(cat.birthday),
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
            cat: cat,
        },
        header: 'Create a comment',
        width: '50%'
       })

       // subscribe to the close event of the modal 
       // and update the comment returned 
        dialogRef.onClose.subscribe((comment: IComment) => {
            for(let c of this.cats) {
                if(c.id === cat.id) {
                    c.comments = c.comments ? [...c.comments, comment] : [comment];
                    c.avg_rating = c.comments!.reduce((acc, c) => acc + c.note, 0) / (c.comments?.length || 1);
                }
            }

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The comment is created' });
        })
    }

    startCommentEdit(comment: IComment, cat: ICat): void {
        const dialogRef = this.dialogService.open(EditCommentComponent, {
            data: {
                comment: comment,
            },
            header: 'Edit a comment',
            width: '50%'
        })

        // subscribe to the close event of the modal
        // and update the comment returned
        dialogRef.onClose.subscribe((comment: IComment) => {
            for(let c of this.cats) {
                if(c.id === cat.id) {
                    c.comments = c.comments?.map((c) => c.id === comment.id ? comment : c);
                    c.avg_rating = c.comments!.reduce((acc, c) => acc + c.note, 0) / (c.comments?.length || 1);
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
            // return birthday as a string dd-mm-yyyy
            birthday: this.datePipe.transform(this.editCatForm.get('birthday')?.value, 'YYYY-MM-dd')!,
            description: this.editCatForm.get('description')?.value,
          };
      
          this.catsService.update(cat).subscribe(cat => {
            this.cats = this.cats.map(c => c.id === cat.id ? cat : c);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The cat is updated' });
          });
      
          this.editSidebarIsOpened = false;
    }

    closeSidebar(): void {
        this.editSidebarIsOpened = false;
    }
}