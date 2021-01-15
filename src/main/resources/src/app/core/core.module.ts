import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { MenuDirective } from './menu.directive';
import { SignInComponent } from './sign-in/sign-in.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login';
import { AuthGuard } from './auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, MainComponent, MenuDirective, SignInComponent, 
    AlertComponent, LoginComponent, HomeComponent],
  imports: [
    SharedModule,AppRoutingModule
  ],
  exports: [HeaderComponent, FooterComponent, AppRoutingModule, SignInComponent , AlertComponent, LoginComponent, HomeComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
 }