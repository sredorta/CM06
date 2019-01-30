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
import { LivraisonComponent } from './livraison/livraison.component';
import { MentionsLegalesComponent } from './mentions-legales/mentions-legales.component';
import { ConditionsGeneralesVenteComponent } from './conditions-generales-vente/conditions-generales-vente.component';
import { PayementSecuriseComponent } from './payement-securise/payement-securise.component';
import { ConfigurationComponent } from './_admin/configuration/configuration.component';
import { OrderStepperComponent } from './order-stepper/order-stepper.component';
import { OrdersComponent} from './_admin/orders/orders.component';
//Guards
import {AdminGuard} from './_guards/admin.guard';
import {RegisteredGuard} from './_guards/registered.guard';
import {UnregisteredGuard} from './_guards/unregistered.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },  
  {
    path: 'login',
    component: LoginComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [UnregisteredGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [UnregisteredGuard]
  },   
  {
    path: 'resetpassword',
    runGuardsAndResolvers: 'always',
    component: ResetpasswordComponent,
    canActivate: [UnregisteredGuard]
  },  
  {
    path: 'profile',
    runGuardsAndResolvers: 'always',
    component: ProfileComponent,
    canActivate: [RegisteredGuard]
  },  

  {
    path: 'admin-members',
    runGuardsAndResolvers: 'always',
    component: MembersComponent,
    canActivate: [AdminGuard]
  },    


  {
    path: 'admin-products',
    runGuardsAndResolvers: 'always',
    component: ProductsComponent,
    canActivate: [AdminGuard]
  },    
  {
    path: 'admin-commandes',
    runGuardsAndResolvers: 'always',
    component: OrdersComponent,
    canActivate: [AdminGuard]
  },   
  
  {
    path: 'admin-configuration',
    runGuardsAndResolvers: 'always',
    component: ConfigurationComponent,
    canActivate: [AdminGuard]
  },  

  {
    path: 'admin-product-create',
    runGuardsAndResolvers: 'always',
    component: ProductCreateStepperComponent,
    canActivate: [AdminGuard]
  },    
  {
    path: 'vehicles',
    runGuardsAndResolvers: 'always',
    component: VehiclesComponent,
  },
  {
    path: 'pièces',
    runGuardsAndResolvers: 'always',
    component: PiecesComponent,
  },

  {
    path: 'contact',
    runGuardsAndResolvers: 'always',
    component: ContactComponent,
  },

  {
    path: 'produit/:id',
    runGuardsAndResolvers: 'always',
    component: ProductItemDetailComponent,
  },   
  {
    path: 'commande',
    runGuardsAndResolvers: 'always',
    component: OrderStepperComponent,    
  },
  {
    path: 'livraison',
    runGuardsAndResolvers: 'always',
    component: LivraisonComponent,
  },
  {
    path: 'mentions-legales',
    runGuardsAndResolvers: 'always',
    component: MentionsLegalesComponent,
  },  
  {
    path: 'conditions-generales-de-vente',
    runGuardsAndResolvers: 'always',
    component: ConditionsGeneralesVenteComponent,
  }, 
  {
    path: 'payement-securise',
    runGuardsAndResolvers: 'always',
    component: PayementSecuriseComponent,
  },   

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
