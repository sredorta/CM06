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

// NGX-TRANSLATE 
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

/////////////////// LIBRARY //////////////////////////////////////////////////
//HTTP
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpHeaderInterceptor} from './_library/helpers/http-header-interceptor';
import {ErrorInterceptor} from './_library/helpers/error.interceptor';
import {CustomValidators} from './_library/helpers/custom.validators';
//POPUPS
import { ErrorSheetComponent } from './_library/helpers/error-sheet/error-sheet.component';
import { TermsDialogComponent } from './_library/auth/terms-dialog/terms-dialog.component';
//PIPES
import { NiceDateFormatPipe } from './_library/pipes/nice-date-format.pipe';
//SERVICES
import {ApiService} from './_library/services/api.service';
//COMPONENTS
import { LoginComponent } from './_library/auth/login/login.component';
import { SignupComponent } from './_library/auth/signup/signup.component';
import {InputImageComponent} from './_library/input-image/input-image.component';
/////////////////// END LIBRARY //////////////////////////////////////////////

//COMPONENTS
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    //Library part
    LoginComponent,
    ErrorSheetComponent,
    SignupComponent,
    TermsDialogComponent,
    InputImageComponent,
    NiceDateFormatPipe,
    HomeComponent
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
    TooltipModule
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
  entryComponents: [ErrorSheetComponent,TermsDialogComponent],
  providers: [
    HttpClient, ApiService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, 
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true }    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(https: HttpClient) : TranslateHttpLoader {
  return new TranslateHttpLoader(https, './assets/i18n/', '.json');
}