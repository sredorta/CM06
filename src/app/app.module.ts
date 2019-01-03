import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from '@angular/forms';
import {FormBuilder, FormGroup, FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
//MATERIAL DESIGN
//Material design
import {MatIconRegistry} from '@angular/material';
import {MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule} from '@angular/material';

//PRIME-NG COMPONENTS
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {ListboxModule} from 'primeng/listbox';
import {ColorPickerModule} from 'primeng/colorpicker';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {GMapModule} from 'primeng/gmap';
import {TooltipModule} from 'primeng/tooltip';
import {GalleriaModule} from 'primeng/galleria';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

// NGX-TRANSLATE 
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

/////////////////// LIBRARY //////////////////////////////////////////////////
//HTTP
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpHeaderInterceptor} from './_helpers/http-header-interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {CustomValidators} from './_helpers/custom.validators';
//POPUPS
import { ErrorSheetComponent } from './_helpers/error-sheet/error-sheet.component';
import { TermsDialogComponent } from './_auth/terms-dialog/terms-dialog.component';
import { MakeSureDialogComponent } from './_library/make-sure-dialog/make-sure-dialog.component';
//DIRECTIVES
import { OnlyNumberDirective } from './_directives/onlyNumber.directive';
import { CurrencyFormatDirective } from './_directives/currency-format.directive';
//PIPES
import { NiceDateFormatPipe } from './_pipes/nice-date-format.pipe';
import { CurrencyFormatPipe } from './_pipes/currency-format.pipe';

//SERVICES
import {ApiService} from './_services/api.service';
import {DataService} from './_services/data.service';
//COMPONENTS
import { LoginComponent } from './_auth/login/login.component';
import { SignupComponent } from './_auth/signup/signup.component';
import {ResetpasswordComponent} from './_auth/resetpassword/resetpassword.component';

import {InputImagesComponent} from './_library/input-images/input-images.component';
import {InputPlusMinusComponent } from './_library/input-plus-minus/input-plus-minus.component';

/////////////////// END LIBRARY //////////////////////////////////////////////

//COMPONENTS
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrandsComponent } from './_admin/brands/brands.component';
import { ModelsComponent } from './_admin/models/models.component';
import { SearchBrandComponent } from './_library/search-brand/search-brand.component';
import { InitComponent } from './init/init.component';
import { ProductCreateUpdateComponent } from './_admin/product-create-update/product-create-update.component';
import { ProductCreateStepperComponent } from './_admin/product-create-stepper/product-create-stepper.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductItemDialogComponent } from './product-item-dialog/product-item-dialog.component';
import { ProductsComponent } from './_admin/products/products.component';


@NgModule({
  declarations: [
    AppComponent,
    //Library part
    LoginComponent,
    SignupComponent,
    TermsDialogComponent,
    ResetpasswordComponent,
    ErrorSheetComponent,
    MakeSureDialogComponent,
    InputImagesComponent,
    NiceDateFormatPipe,
    OnlyNumberDirective,
    HomeComponent,
    BrandsComponent,
    ModelsComponent,
    SearchBrandComponent,
    InitComponent,
    ProductCreateUpdateComponent,
    ProductCreateStepperComponent,
    ProductItemComponent,
    ProductItemDialogComponent,
    InputPlusMinusComponent,
    InputImagesComponent,
    ProductsComponent,
    CurrencyFormatPipe,
    CurrencyFormatDirective
    //End of library
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    [PasswordModule, //PRIME-NG modules
    InputTextModule,
    ListboxModule,
    CheckboxModule,
    ButtonModule,
    ColorPickerModule,
    GMapModule,
    TooltipModule,
    ToastModule,
    GalleriaModule
    ],
    [  MatAutocompleteModule, //MATERIAL2
      MatBadgeModule,
      MatBottomSheetModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatChipsModule,
      MatDatepickerModule,
      MatDialogModule,
      MatDividerModule,
      MatExpansionModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatNativeDateModule,
      MatPaginatorModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatRippleModule,
      MatSelectModule,
      MatSidenavModule,
      MatSliderModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatStepperModule,
      MatTableModule,
      MatTabsModule,
      MatToolbarModule,
      MatTooltipModule,
      MatTreeModule         
    ],    
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
  entryComponents: [ErrorSheetComponent,TermsDialogComponent, MakeSureDialogComponent, ProductItemDialogComponent],
  providers: [
    HttpClient, ApiService, DataService, MakeSureDialogComponent, ProductItemDialogComponent, MessageService, CurrencyFormatPipe,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, 
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true }    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(https: HttpClient) : TranslateHttpLoader {
  return new TranslateHttpLoader(https, './assets/i18n/', '.json');
}