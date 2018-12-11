import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './_library/auth/login/login.component';
import {SignupComponent} from './_library/auth/signup/signup.component';
import {ResetpasswordComponent} from './_library/auth/resetpassword/resetpassword.component';
import {BrandsComponent} from './_admin/brands/brands.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //canActivate: [LoggedOutGuard]
  },  
  {
    path: 'login',
    component: LoginComponent,
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    //canActivate: [LoggedOutGuard]
  },   
  {
    path: 'resetpassword',
    component: ResetpasswordComponent,
    //canActivate: [LoggedOutGuard]
  },  
  {
    path: 'admin_marques',
    component: BrandsComponent,
    //canActivate: [AdminGuard]
  },    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
