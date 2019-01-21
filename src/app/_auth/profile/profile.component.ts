import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { OnlyNumberDirective } from '../../_directives/onlyNumber.directive';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';

import { User } from '../../_models/user';
import { ApiService} from '../../_services/api.service';
import { Subscription } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],      
})
export class ProfileComponent implements OnInit {
  user : User;
  myForm: FormGroup; 
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  validation_messages = CustomValidators.getMessages();
  showPassword :boolean = false;
  showAvatar : boolean = false;
  defaultImage :string = "./assets/images/userdefault.jpg";

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService) { }

  ngOnInit() {
   this.createForm();
   this._subscriptions.push(this.api.getAuthUser().subscribe(res => {
      this.user = new User(res);
      this.myForm.controls["firstName"].setValue(this.user.firstName);
      this.myForm.controls["lastName"].setValue(this.user.lastName);
      this.myForm.controls["email"].setValue(this.user.email);
      this.myForm.controls["mobile"].setValue(this.user.mobile);
    }));
  }
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
      password_old: new FormControl('', Validators.compose([
        CustomValidators.validPassword
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
      avatar: new FormControl(null,null)
    });
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }    
}
