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
import { ParentFormComponent } from './person-form/parents-form/parent-form.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { RelationChartComponent } from './relations/relation-chart/relation-chart.component';
import { RelationsComponent } from './relations/relations.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';


@NgModule({
  exports: [SearchComponent, SharedModule],
  declarations: [SearchComponent, ProfileComponent, EditComponent, QuickCreateComponent, 
    PersonFormComponent, AddComponent, MainComponent,  ChildrenFormComponent, LinkFormComponent, RelationsFormComponent, ParentFormComponent, RelationChartComponent, RelationsComponent, FamilyTreeComponent],
   
  imports: [
    CommonModule,
    PeopleRoutingModule,
    SharedModule, NgxGraphModule 
  ],
  providers: [
    DatePipe
  ]
})
export class PeopleModule { }
