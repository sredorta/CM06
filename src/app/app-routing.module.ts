import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './_library/auth/login/login.component';
import {SignupComponent} from './_library/auth/signup/signup.component';
import {ResetpasswordComponent} from './_library/auth/resetpassword/resetpassword.component';
import {ProductCreateStepperComponent} from './_admin/product-create-stepper/product-create-stepper.component';
import {ProductCreateUpdateComponent} from './_admin/product-create-update/product-create-update.component';
import {ProductsComponent} from './_admin/products/products.component';

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
    path: 'admin-product-create',
    component: ProductCreateStepperComponent,
    //canActivate: [AdminGuard]
  },    
  {
    path: 'admin-products',
    component: ProductsComponent,
    //canActivate: [AdminGuard]
  },    
  {
    path: 'tmp',
    component: ProductCreateUpdateComponent,
    //canActivate: [AdminGuard]
  },   
/*  {
    path: 'admin-modeles',///:id',
    component: ModelsComponent,
    //canActivate: [LoggedInGuard]
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
