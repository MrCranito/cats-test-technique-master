import { NgModule } from "@angular/core";
import { CatsRoutingModule } from "./cats.routing.module";
import { CatsFormComponent } from "./pages/cats-form/cats-form.component";
import { CatsListComponent } from "./pages/cats-list/cats-list.component";

@NgModule({
    declarations: [
        CatsFormComponent,
        CatsListComponent
    ],
    imports: [CatsRoutingModule],
    exports: [CatsRoutingModule]
})
export class CatsModule { }