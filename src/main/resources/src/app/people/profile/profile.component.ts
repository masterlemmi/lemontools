import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../services/people.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  person$: Observable<Person>;

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.person$ = this.route.paramMap.map(paramMap => +paramMap.get('personId')) /// map the route params to one element
    .switchMap(id => this.peopleService.getPerson(id)) // change the main stream to the Http async request
    .share(); // prevent the request being done multiple times


  }

  toRoute(id: number) {
    const rt = `/people/profile/${id}`;
    this.router.navigateByUrl(rt);
  }

  edit(p: Person){
    const rt = `/people/edit/${p.id}`;
    // this.router.navigateByUrl(rt);
    this.router.navigate([rt], {state: {data: p}});
  }

}
