
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { RelationChartComponent } from './relations/relation-chart/relation-chart.component';
import { RelationsComponent } from './relations/relations.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  { path: '', component: MainComponent }, // default route of the module
  { path: 'add', component: AddComponent},
  { path: 'profile/:personId', component: ProfileComponent },
  { path: 'edit/:personId', component: EditComponent},
  { path: 'relations', component: RelationsComponent},
  { path: 'family-tree', component: FamilyTreeComponent},


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
