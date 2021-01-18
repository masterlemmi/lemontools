import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  AuthGuard } from './auth-guard.service';
//import { NotfoundComponent } from 'app/shared/notfound/notfound.component';

import { MainComponent } from './main/main.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LoginComponent } from './login';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

{ path: 'manga', loadChildren: () => import('../manga/manga.module').then(m => m.MangaModule)},
{ path: 'people', loadChildren: () => import('../people/people.module').then(m => m.PeopleModule)},
{ path: '', component: HomeComponent, pathMatch: 'full' },
{ path: 'home', component: HomeComponent },
{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent },

// otherwise redirect to home
{ path: '**', redirectTo: '' }
]; 


@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
