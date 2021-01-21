import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { PeopleRoutingModule } from './people-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './edit/edit.component';
import { SearchComponent } from './search/search.component';
import { AddComponent } from './add/add.component';
import { MainComponent } from './main/main.component';
import { QuickCreateComponent } from './quick-create/quick-create.component';
import { PersonFormComponent } from './person-form/person-form.component';
import { ChildrenFormComponent } from './person-form/children-form/children-form.component';
import { LinkFormComponent } from './person-form/link-form/link-form.component';
import { RelationsFormComponent } from './person-form/relations-form/relations-form.component';


@NgModule({
  exports: [SearchComponent, SharedModule],
  declarations: [SearchComponent, ProfileComponent, EditComponent, QuickCreateComponent, 
    PersonFormComponent, AddComponent, MainComponent,  ChildrenFormComponent, LinkFormComponent, RelationsFormComponent],
   
  imports: [
    CommonModule,
    PeopleRoutingModule,
    SharedModule
  ],
  providers: [
    DatePipe
  ]
})
export class PeopleModule { }
