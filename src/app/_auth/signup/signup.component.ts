import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
//Import all shared logic required for forms handling
import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';

//Dialogs
import {TermsDialogComponent} from '../terms-dialog/terms-dialog.component';
//Directives
import { OnlyNumberDirective } from '../../_directives/onlyNumber.directive';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  validation_messages = CustomValidators.getMessages();
  myForm: FormGroup; 
  highlight: boolean = false;
  defaultImage :string = "./assets/images/userdefault.jpg";

  private _subscriptions : Subscription[] = new Array<Subscription>();

  @ViewChild('avatar') inputImage : InputImagesComponent;


  constructor(private api: ApiService, 
              private location : Location, 
              private router : Router, 
              public dialog: MatDialog,
              private spinner: SpinnerOverlayService) { }


  createForm() {
    this.myForm =  new FormGroup({    
      firstName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),         
      mobile: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),       
        CustomValidators.validMobile
      ])),       
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      matching_passwords_group : new FormGroup({
        password: new FormControl('', Validators.compose([
          CustomValidators.validPassword
        ])),
        confirm_password: new FormControl('', Validators.compose([
          Validators.required
        ]))},
        (formGroup: FormGroup) => {
          return CustomValidators.areEqual(formGroup);
        }        
      ),
      avatar: new FormControl(null,null),
      terms: new FormControl(false,null)
    });
    this.myForm.controls["terms"].disable();
  }


  ngOnInit() {
    this.createForm();
    //Reset password confirm if we modify password
    this._subscriptions.push(this.myForm.get("matching_passwords_group").get("password").valueChanges.subscribe(val=> {
      this.myForm.get("matching_passwords_group").get("confirm_password").reset();
    }));
    //Reset terms highlight on any input
    this._subscriptions.push(this.myForm.statusChanges.subscribe(val=> {
      this.highlight = false;
    }));
  }

  //Terms and conditions dialog  
  openTermsAndConditionsDialog(): void {
    let dialogRef = this.dialog.open(TermsDialogComponent, {
      panelClass: 'big-dialog',
      width: '95%',
      height: '95%',
      data:  null 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.myForm.patchValue({"terms" : result});
    });
  }

  //From submit
  onSubmit(value) {
   console.log(value);
   //return;
    this.highlight = false;
    if (!this.myForm.controls.terms.value) {
      this.highlight = true;
      return;
    }
    //Handle invalid form
    if (this.myForm.invalid) {
      return;
    }  
    this.spinner.show();
    this._subscriptions.push(this.api.signup(value.firstName, value.lastName, value.email, value.mobile, value.matching_passwords_group.password, value.avatar).subscribe(
      (result: any) => {
        this.spinner.hide();
        this.router.navigate([""]);                 
      },
      error => {
        this.spinner.hide();
        console.log(error);
      })); 
  }

  resetForm() {
    this.myForm.reset();
    this.inputImage.resetImage();
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
