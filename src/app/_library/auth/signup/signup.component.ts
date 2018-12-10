import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
//Import all shared logic required for forms handling
import {CustomValidators, ParentErrorStateMatcher  } from '../../helpers/custom.validators';
import {InputImageComponent} from '../../input-image/input-image.component';

//Dialogs
import {TermsDialogComponent} from '../terms-dialog/terms-dialog.component';
//Directives
import { OnlyNumberDirective } from '../../directives/onlyNumber.directive';
import { ApiService } from '../../services/api.service';

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
  loading :boolean = false;
  avatar : Blob = null;

  private _subscriptions : Subscription[] = new Array<Subscription>();
  constructor(private api: ApiService, private location : Location, private router : Router, public dialog: MatDialog) { }


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
  }

    //Update photo if we change it
/*    onImageChange(photo:string) {
      console.log("SIZE IS : " + photo.length);
      console.log(photo);
      fetch(photo)
        .then(res => res.blob())
        .then(blob => this.avatar = blob);
      //this.avatar = photo;
    }*/

  ngOnInit() {
    this.createForm();
    //Reset password confirm if we modify password
    this._subscriptions.push(this.myForm.get("matching_passwords_group").get("password").valueChanges.subscribe(val=> {
      this.myForm.get("matching_passwords_group").get("confirm_password").reset();
    }));
  }

  //Terms and conditions dialog  
  openTermsAndConditionsDialog(): void {
    let dialogRef = this.dialog.open(TermsDialogComponent, {
      panelClass: 'big-dialog',
      width: '80%',
      height: '80%',
      data:  null 
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
    this.loading = true; 
    this._subscriptions.push(this.api.signup(value.firstName, value.lastName, value.email, value.mobile, value.matching_passwords_group.password, value.avatar).subscribe(
      (result: any) => {
        this.loading = false;
        console.log(result);
        //this.router.navigate([""]);                 
      },
      error => {
        console.log(error);
          this.loading = false;
      })); 
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
