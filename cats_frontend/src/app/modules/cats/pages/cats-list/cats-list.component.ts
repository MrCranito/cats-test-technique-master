import { Component, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { ActivatedRoute, Router } from "@angular/router";
import { IComment } from "../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FilterMatchMode, MessageService, SelectItem } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { CreateCommentComponent } from "../../components/modals/create-comment/create-comment.component";
import { EditCommentComponent } from "../../components/modals/edit-comment/edit-comment.component";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { CatsActions } from "../../store/actions/cats.actions";
import { CommentsActions } from "../../store/actions/comments.actions";

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
    filters: { [key: string]: { value: string, matchMode: string }} = {};
    sortField: string = '';
    sortOrder: number = 1;
    searchText: FormControl = new FormControl('');

    // forms
    editCatForm: FormGroup = new FormGroup({
        id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        breed: new FormControl(new Date(), [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
    });

    constructor(
        private dialogService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private store: Store
        ) { }

    ngOnInit(): void {

        // load cats from the store
        // without any params on first load
        this.store.dispatch(CatsActions.load({ params: {}}));

        // search from name input
        // debounce 300ms before sending the request
        this.searchText.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((_) => {

            // dispatch the load action
            // remove page query param

            this.store.dispatch(CatsActions.load({ params: {
                field: this.sortField,
                search: this.searchText.value,
                filters: this.filters
            }}));
        })

    }

    // lazy load call
    // each filters and sorting event 
    // will trigger this function
    loadCat($event: any): void {

        this.filters = $event.filters;
        this.first = $event.first;
        this.sortField = $event.sortField;
        this.sortOrder = $event.sortOrder;

        // dispatch the load action
        // with the page query param
        this.store.dispatch(CatsActions.load({ params: {
            page: this.first / this.rows + 1,
            field: this.sortField,
            search: this.searchText.value,
            filters: this.filters
        }}));
    }

    // called when user is expanding a cat
    expand(cat: ICat): void {

        // dispatch the load action
        this.store.dispatch(CommentsActions.load({ id: cat.id! }));
    }

    goToCreate(): void {
        this.router.navigate(['cats/create']);
    }

    deleteCat(cat: ICat): void {

        // dispatch the delete action
        this.store.dispatch(CatsActions.delete({ id: cat.id! }));
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


    cancelCatEdit(): void { 
        this.editSidebarIsOpened = false;
    }

    startCommentCreate(cat: ICat): void {
       this.dialogService.open(CreateCommentComponent, {
            data: {
                cat: cat,
            },
            header: 'Create a comment',
            width: '50%'
       })

    //    // subscribe to the close event of the modal 
    //    // and update the comment returned 
    //     dialogRef.onClose.subscribe((comment: IComment) => {
    //         for(let c of this.cats) {
    //             if(c.id === cat.id) {
    //                 c.comments = c.comments ? [...c.comments, comment] : [comment];
    //                 c.avg_rating = c.comments!.reduce((acc, c) => acc + c.note, 0) / (c.comments?.length || 1);
    //             }
    //         }

    //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The comment is created' });
    //     })
    }

    startCommentEdit(comment: IComment, cat: ICat): void {
        this.dialogService.open(EditCommentComponent, {
            data: {
                comment: comment,
            },
            header: 'Edit a comment',
            width: '50%'
        })

        // // subscribe to the close event of the modal
        // // and update the comment returned
        // dialogRef.onClose.subscribe((comment: IComment) => {
        //     for(let c of this.cats) {
        //         if(c.id === cat.id) {
        //             c.comments = c.comments?.map((c) => c.id === comment.id ? comment : c);
        //             c.avg_rating = c.comments!.reduce((acc, c) => acc + c.note, 0) / (c.comments?.length || 1);
        //         }
        //     }

        //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The comment is updated' });
        // })
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

        // dispatch the update action
        this.store.dispatch(CatsActions.update({ cat }));
    }

    closeSidebar(): void {
        this.editSidebarIsOpened = false;
    }

    // add or remove query param of the page
    private updateQueryParam() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: this.first === 0 ? { page: null} : { page: this.first / this.rows + 1 },
            queryParamsHandling: 'merge',
        });
    }
}