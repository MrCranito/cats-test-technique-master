import { NgModule } from "@angular/core";
import { CatsRoutingModule } from "./cats.routing.module";
import { CatsFormComponent } from "./pages/cats-form/cats-form.component";
import { CatsListComponent } from "./pages/cats-list/cats-list.component";
import { TableModule } from 'primeng/table';
import { CatsService } from "./services/cats.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { RatingModule } from "primeng/rating";
import { CommonModule, DatePipe } from "@angular/common";
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { CommentsService } from "./services/comments.service";
import { SidebarModule } from 'primeng/sidebar';
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { CreateCommentComponent } from "./components/modals/create-comment/create-comment.component";
import { EditCommentComponent } from "./components/modals/edit-comment/edit-comment.component";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [
        CatsFormComponent,
        CatsListComponent,
        CreateCommentComponent,
        EditCommentComponent
    ],
    imports: [
        CommonModule,
        CatsRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,

        // PrimeNG
        TableModule,
        ButtonModule,
        InputTextModule,
        RatingModule,
        CardModule,
        ProgressSpinnerModule,
        ToastModule,
        SidebarModule,
        DynamicDialogModule,
        DropdownModule,
        CalendarModule
    ],
    providers: [CatsService, CommentsService, DialogService, MessageService, DatePipe],
    exports: [CatsRoutingModule]
})
export class CatsModule { }