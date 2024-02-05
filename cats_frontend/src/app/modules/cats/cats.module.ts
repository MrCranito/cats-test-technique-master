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
import { CommonModule } from "@angular/common";
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        CatsFormComponent,
        CatsListComponent
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
    ],
    providers: [CatsService, MessageService],
    exports: [CatsRoutingModule]
})
export class CatsModule { }