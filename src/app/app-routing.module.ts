import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './_auth/login/login.component';
import {SignupComponent} from './_auth/signup/signup.component';
import {ResetpasswordComponent} from './_auth/resetpassword/resetpassword.component';
import {ProductCreateStepperComponent} from './_admin/product-create-stepper/product-create-stepper.component';
import {ProductCreateUpdateComponent} from './_admin/product-create-update/product-create-update.component';
import {ProductsComponent} from './_admin/products/products.component';
import {ProductItemDetailComponent} from './product-item-detail/product-item-detail.component';
import {MembersComponent} from './_admin/members/members.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { PiecesComponent } from './pieces/pieces.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './_auth/profile/profile.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //canActivate: [LoggedOutGuard]
  },  
  {
    path: 'login',
    component: LoginComponent,
    runGuardsAndResolvers: 'always',
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    runGuardsAndResolvers: 'always',
    //canActivate: [LoggedOutGuard]
  },   
  {
    path: 'resetpassword',
    runGuardsAndResolvers: 'always',
    component: ResetpasswordComponent,
    //canActivate: [LoggedOutGuard]
  },  
  {
    path: 'profile',
    runGuardsAndResolvers: 'always',
    component: ProfileComponent,
    //canActivate: [LoggedOutGuard]
  },  

  {
    path: 'admin-members',
    runGuardsAndResolvers: 'always',
    component: MembersComponent,
    //canActivate: [AdminGuard]
  },    


  {
    path: 'admin-products',
    runGuardsAndResolvers: 'always',
    component: ProductsComponent,
    //canActivate: [AdminGuard]
  },    
  {
    path: 'admin-product-create',
    runGuardsAndResolvers: 'always',
    component: ProductCreateStepperComponent,
    //canActivate: [AdminGuard]
  },    
  {
    path: 'vehicles',
    runGuardsAndResolvers: 'always',
    component: VehiclesComponent,
    //canActivate: [AnyGuard]
  },
  {
    path: 'pièces',
    runGuardsAndResolvers: 'always',
    component: PiecesComponent,
    //canActivate: [AnyGuard]
  },
  {
    path: 'pannier',
    runGuardsAndResolvers: 'always',
    component: CartComponent,
    //canActivate: [AnyGuard]
  },

  {
    path: 'contact',
    runGuardsAndResolvers: 'always',
    component: ContactComponent,
    //canActivate: [AnyGuard]
  },

  {
    path: 'produit/:id',
    runGuardsAndResolvers: 'always',
    component: ProductItemDetailComponent,
    //canActivate: [AnyGuard]
  },   
/*  {
    path: 'admin-modeles',///:id',
    component: ModelsComponent,
    //canActivate: [LoggedInGuard]
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
