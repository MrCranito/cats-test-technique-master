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

@NgModule({
    declarations: [
        CatsFormComponent,
        CatsListComponent
    ],
    imports: [
        CatsRoutingModule,
        HttpClientModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule
    ],
    providers: [CatsService],
    exports: [CatsRoutingModule]
})
export class CatsModule { }