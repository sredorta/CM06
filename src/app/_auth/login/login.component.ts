import { Component, OnInit,ViewChild } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';

import {CustomValidators} from '../../_helpers/custom.validators';
import {ApiService, IApiLogin, IApiUserAuth} from '../../_services/api.service';
import {User} from '../../_models/user';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myForm : FormGroup;
  validation_messages = CustomValidators.getMessages();
  accounts = new Array<string>();
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, 
              private location : Location,
              private router : Router,
              private spinner: SpinnerOverlayService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.myForm =  new FormGroup({    
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        CustomValidators.validPassword
      ])),
      keepconnected: new FormControl(false,null),
      access: new FormControl(null,null)
    });
  }
  //When email changes we reset the access to not be showing
  emailChange(event) {
    this.accounts = [];
  }


  resetForm() {
    this.myForm.reset();
    this.accounts=[];
  }


  onSubmit(value) {
    console.log(value);
    if (this.myForm.invalid) {
      console.log("invalid");
      return;
    }
    this.spinner.show();
    this._subscriptions.push(this.api.login(value.email,value.password,value.keepconnected,value.access).subscribe((res:IApiLogin) => {
      console.log(res);
      if (res.access != null) {
        this.accounts = res.access;
        this.spinner.hide();
      } else {
        User.saveToken(res.token);   //Save Token to session storage
        //We need to download here the profile of the user
        this._subscriptions.push(this.api.getAuthUser().subscribe((res: IApiUserAuth)=> {
          this.api.setCurrent(res); 
          this.spinner.hide();
          this.router.navigate([""]); //Back home
        },err=> {
          this.spinner.hide();
        }));
      }
    }, err => {
      this.spinner.hide();
    }));
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }



}
