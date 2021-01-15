
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  { path: '', component: SearchComponent }, // default route of the module
  { path: 'profile/:personId', component: ProfileComponent },
  { path: 'edit/:personId', component: EditComponent}

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
