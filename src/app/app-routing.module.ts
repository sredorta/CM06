import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './_library/auth/login/login.component';
import {SignupComponent} from './_library/auth/signup/signup.component';
import {ResetpasswordComponent} from './_library/auth/resetpassword/resetpassword.component';
import {BrandsComponent} from './_admin/brands/brands.component';
import {ModelsComponent} from './_admin/models/models.component';

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
    path: 'admin-marques',
    component: BrandsComponent,
    children: [
      //{path: '', redirectTo: 'modeles'},
      {path: "modeles/:idbrand", component: ModelsComponent}
    ]
    //canActivate: [AdminGuard]
  },    
  {
    path: 'admin-modeles/:idbrand',///:id',
    component: ModelsComponent,
    //canActivate: [LoggedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
