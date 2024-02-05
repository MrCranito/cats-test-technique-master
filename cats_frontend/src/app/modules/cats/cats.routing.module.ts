import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CatsListComponent } from "./pages/cats-list/cats-list.component";
import { CatsFormComponent } from "./pages/cats-form/cats-form.component";


const routes: Routes = [
    {
        path: '', component: CatsListComponent,
    },
    {
        path: 'create', component: CatsFormComponent
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatsRoutingModule {}