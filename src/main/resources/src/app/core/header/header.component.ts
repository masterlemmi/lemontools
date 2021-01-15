import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user = {name: ""}


  constructor(private authService: AuthenticationService, private router: Router) { 
    
  }

  ngOnInit(): void {
  }



  logout(){
    this.authService.logout();
    this.router.navigate(["/login"])
  }

  home(){
    this.router.navigate(["/home"])
  }


}
