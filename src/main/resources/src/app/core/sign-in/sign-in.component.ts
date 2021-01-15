import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor() { }


  login() {
   // this.authService.clearCookies();
    window.location.href = 'http://localhost:8089/auth/code';
 }


  ngOnInit(): void {
  }
 
}
