import { Component, OnInit, createPlatformFactory } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatRadioChange } from '@angular/material';

//Import all shared logic required for forms handling
import {CustomValidators  } from '../../_helpers/custom.validators';
import {ApiService} from '../../_services/api.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  myForm: FormGroup;

  //Access handling
  accessAvailable = new Array<string>() 
  accessSelected : string = null;

  //Get error messages
  validation_messages = CustomValidators.getMessages();
  loading = false;    //Tells html we are loading
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private _location: Location, private api : ApiService) { }

  ngOnInit() {
    this.myForm = this.createForm(); 
  }

  createForm() {
    return new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ]))
    });
  }

  //Reset access box
  resetAccess() {
    this.accessAvailable = new Array<string>(); //Reset the access of the account
    this.accessSelected = null;
  }
  //Detect changes on multiple accounts radio button
  radioChange(event: MatRadioChange) {
    this.accessSelected = event.value;
  }
  //When email changes we reset the access to not be showing
  emailChange(event) {
    this.resetAccess();
  }

  //From submit
  onSubmit(value) {
    if (this.myForm.invalid) {
      return;
    }
    this.loading = true;
    //request http here !
    this._subscriptions.push(this.api.resetPassword(value.email, this.accessSelected).subscribe(
        result => {
          console.log(result);
          //We check if we got multiple access
          if (result.response === "multiple_access") {
            //Update the html to show the available access
            this.accessAvailable = result.message;
            this.accessSelected = result.message[0];
          } 
          this.loading = false;
        },
        error => {
            this.loading = false;
        })
    );
  }

  //Go back if we cancel
  goBack() {
    this._location.back(); 
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

}
