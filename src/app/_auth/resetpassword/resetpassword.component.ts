import { Component, OnInit, createPlatformFactory } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatRadioChange } from '@angular/material';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';
import { Router} from '@angular/router';

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
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private _location: Location, 
              private api : ApiService,
              private spinner: SpinnerOverlayService,
              private router: Router) { }

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
    this.spinner.show();
    //request http here !
    this._subscriptions.push(this.api.resetPassword(value.email, this.accessSelected).subscribe(
        result => {
          console.log(result);
          //We check if we got multiple access
          if (result.access) {
            console.log("Multiple access !!!");
            console.log(result.access);
            //Update the html to show the available access
            this.accessAvailable = result.access;
            this.accessSelected = result.access[0];
          } 
          this.spinner.hide();
        },
        error => {
            this.spinner.hide();
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
