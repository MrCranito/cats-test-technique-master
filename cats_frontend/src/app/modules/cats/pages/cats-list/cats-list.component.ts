import { Component, OnDestroy, OnInit } from "@angular/core";
import { ICat } from "../../models/cat.model";
import { ActivatedRoute, Router } from "@angular/router";
import { IComment } from "../../models/comment.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FilterMatchMode } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { CreateCommentComponent } from "../../components/modals/create-comment/create-comment.component";
import { EditCommentComponent } from "../../components/modals/edit-comment/edit-comment.component";
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { Store, select } from "@ngrx/store";
import { CatsActions } from "../../store/actions/cats.actions";
import { CommentsActions } from "../../store/actions/comments.actions";
import { selectCatWithComments, selectCount } from "../../store/selectors/cats.selectors";
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-cats-list',
    templateUrl: './cats-list.component.html'
})
export class CatsListComponent implements OnInit, OnDestroy {

     // subject
     private _unsubscribe$$ = new Subject<void>();

    // observables
    cats$: Observable<ICat[]> = this.store.pipe(takeUntil(this._unsubscribe$$), select(selectCatWithComments));
    count$: Observable<number> = this.store.pipe(takeUntil(this._unsubscribe$$), select(selectCount));

    // booleans
    editSidebarIsOpened: boolean = false;
    
    // table options
    cols: { field: string, header: string }[] = [
        { field: 'name', header: 'Name' },
        { field: 'breed', header: 'Breed' },
        { field: 'birthday', header: 'Birthday' },
        { field: 'description', header: 'Description' },
    ]
    matchFiltersModeOptionsText = [
        { label: 'Contains', value: FilterMatchMode.CONTAINS },
        { label: 'In', value: FilterMatchMode.IN },
    ]
    matchFiltersModeOptionsNumber = [
        { label: 'Greater than', value: FilterMatchMode.GREATER_THAN },
        { label: 'Less than', value: FilterMatchMode.LESS_THAN },
    ]
    first: number = 0;
    rows: number = 10;
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
        private store: Store,
        ) { }

    ngOnInit(): void {

        // search from name input
        // debounce 300ms before sending the request
        this.searchText.valueChanges.pipe(
            takeUntil(this._unsubscribe$$),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((_) => {
            this.store.dispatch(CatsActions.load({ params: {
                page: this.first / this.rows + 1,
                field: this.sortOrder == -1 ? '-' + this.sortField : this.sortField,
                search: this.searchText.value != '' ? this.searchText.value : null,                    
                }})
            )
        })
    }

    ngOnDestroy(): void {
        this._unsubscribe$$.next();
        this._unsubscribe$$.complete();
    }

    // lazy load call
    // each filters and sorting event 
    // will trigger this function
    loadCat($event: any): void {

        let filters = cloneDeep($event.filters);
        this.first = $event.first;
        this.sortField = $event.sortField;
        this.sortOrder = $event.sortOrder;

        // dispatch the load action
        // with the page query param
        this.store.dispatch(CatsActions.load({ params: {
            page: this.first / this.rows + 1,
            field: this.sortOrder == -1 ? '-' + this.sortField : this.sortField,
            search: this.searchText?.value != '' ? this.searchText.value : null,
            filter: Object.keys(filters).length ? filters : {},
        }}));

        this.updateQueryParam();
    }

    // called when user is expanding a cat
    expand(cat: ICat): void {
        // dispatch the load action
        this.store.dispatch(CommentsActions.load({ id: cat.id! }));
    }


    // ** Cats Methods **
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

        // close the sidebar
        this.hideOrShowSideBar();
    }

    deleteCat(cat: ICat): void {

        // dispatch the delete action
        this.store.dispatch(CatsActions.delete({ id: cat.id! }));
    }

    // ** Comments Methods **

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
            if(comment) {
                this.store.dispatch(CommentsActions.add({ comment }));
            }
        })
    }

    startCommentEdit(comment: IComment, cat: ICat): void {
        const dialogRef = this.dialogService.open(EditCommentComponent, {
            data: {
                comment: comment,
                cat: cat,
            },
            header: 'Edit a comment',
            width: '50%'
        })

        // subscribe to the close event of the modal
        // and update the comment returned
        dialogRef.onClose.subscribe((comment: IComment) => {
            if(comment) {
                this.store.dispatch(CommentsActions.update({ comment }));
            }
        })
    }

    //  ** Routing Methods **
    goToCreate(): void {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    // ** Display Methods **

    startCatEdit(cat: ICat): void {
        this.editCatForm.setValue({
            id: cat.id,
            name: cat.name,
            breed: cat.breed,
            birthday: new Date(cat.birthday),
            description: cat.description
        });
      
        this.hideOrShowSideBar();
    }

    hideOrShowSideBar(): void {
        this.editSidebarIsOpened = !this.editSidebarIsOpened;
    }

    // add or remove query param of the page
    private updateQueryParam(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: this.first === 0 ? { page: null} : { page: this.first / this.rows + 1 },
            queryParamsHandling: 'merge',
        });
    }
}