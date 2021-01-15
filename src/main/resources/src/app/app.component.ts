import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


import { User } from './core/user';
import { AuthenticationService } from './core/_services/authentication.service';

@Component({
  selector: 'app-root',
  template: `
  <app-header *ngIf="currentUser"></app-header>
  <router-outlet></router-outlet>
  `

})

export class AppComponent {

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (!x){
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

