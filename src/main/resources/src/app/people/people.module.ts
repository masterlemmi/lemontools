import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { PeopleRoutingModule } from './people-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { DialogCreatePerson, EditComponent } from './edit/edit.component';
import { SearchComponent } from './search/search.component';



@NgModule({
  declarations: [SearchComponent, ProfileComponent, EditComponent, DialogCreatePerson],
   
  imports: [
    CommonModule,
    PeopleRoutingModule,
    SharedModule
  ],
  exports: [SearchComponent, SharedModule], 
  providers: [
    //PersonService
    DatePipe
  ]
})
export class PeopleModule { }
