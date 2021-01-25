import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../services/people.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { DatePipe, Location } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  person$: Observable<Person>;
  profilePhoto: string = 'https://drive.google.com/uc?export=view&id=1jbqoefsTVSkVAZ8RwVC1CAAljs-M3GJz';

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.person$ = this.route.paramMap.map(paramMap => +paramMap.get('personId')) /// map the route params to one element
    .switchMap(id => this.peopleService.getPerson(id)) // change the main stream to the Http async request
    .share(); // prevent the request being done multiple times

    this.person$.subscribe(data => {
      if (data.photoUrl){
        this.profilePhoto = data.photoUrl;
      } 
    })
  }

  toRoute(id: number) {
    const rt = `/people/profile/${id}`;
    this.router.navigateByUrl(rt);
  }

  toHome() {
    this.router.navigateByUrl('/people');
  }

  edit(p: Person){
    const rt = `/people/edit/${p.id}`;
    // this.router.navigateByUrl(rt);
    this.router.navigate([rt], {state: {data: p}});
  }

  back() {
    this._location.back();
  }

}
