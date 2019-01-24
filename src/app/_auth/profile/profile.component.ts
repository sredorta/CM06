import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { OnlyNumberDirective } from '../../_directives/onlyNumber.directive';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { Router} from '@angular/router';
import { User } from '../../_models/user';
import { ApiService} from '../../_services/api.service';
import { Subscription } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
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
  @ViewChild('avatar') inputImage : InputImagesComponent;
  user : User;
  myForm: FormGroup; 
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  validation_messages = CustomValidators.getMessages();
  showPassword :boolean = false;
  showAvatar : boolean = false;
  defaultImage :string = "./assets/images/userdefault.jpg";

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private spinner : SpinnerOverlayService, private router : Router) { }

  ngOnInit() {
   this.createForm();
   this.spinner.show();
   this._subscriptions.push(this.api.getAuthUser().subscribe(res => {
      this.user = new User(res);
      this.setForm();
      this.spinner.hide();
    },()=> this.spinner.hide()));
  }

  setForm() {
    this.myForm.controls["firstName"].setValue(this.user.firstName);
    this.myForm.controls["lastName"].setValue(this.user.lastName);
    this.myForm.controls["email"].setValue(this.user.email);
    this.myForm.controls["mobile"].setValue(this.user.mobile);
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
        CustomValidators.validPasswordOrNull
      ])),      
      matching_passwords_group : new FormGroup({
        password: new FormControl('', Validators.compose([
          CustomValidators.validPasswordOrNull,
        ])),
        confirm_password: new FormControl('', Validators.compose([
        ]))},
        (formGroup: FormGroup) => {
          return CustomValidators.areEqual(formGroup);
        }        
      ),
      avatar: new FormControl(null,null)
    });
  }


  onSubmit(result) {
    if (this.myForm.invalid) {
      this.showPassword = true;
      return;
    }
    //Case of reset avatar
    if (result.avatar == undefined) {
      result.avatar = "reset";
    }
    this.spinner.show();
    this._subscriptions.push(this.api.updateUser(result.firstName, result.lastName, result.email, result.mobile, result.password_old, result.matching_passwords_group.password, result.avatar).subscribe(res => {
      this._subscriptions.push(this.api.getAuthUser().subscribe(res => {
        this.api.setCurrent(res);
        this.user = new User(res);
        this.setForm();
        this.spinner.hide();
      },()=>this.spinner.hide()))
    },()=> {if (this.spinner.visible) this.spinner.hide();}));

  }

  logout() {
    this.spinner.show();
    this._subscriptions.push(this.api.logout().subscribe(res=> {
      this.api.setCurrent(null);
      User.removeToken();
      this.router.navigate([""]); //Go back home
      this.spinner.hide();
    },() =>this.spinner.hide()));    
  }

  deleteAuth() {
    this.spinner.show();
    this._subscriptions.push(this.api.deleteAuth().subscribe(res=> {
      this.api.setCurrent(null);
      User.removeToken();
      this.router.navigate([""]); //Go back home*/
      this.spinner.hide();
    },()=> this.spinner.hide()));        
  }

  //Highlight if we have modified the field
  isModified(control:string) {
    if (control == "firstName")
      if (this.myForm.controls["firstName"].value != this.user.firstName) {
        return true;
      }
    if (control == "lastName")
      if (this.myForm.controls["lastName"].value != this.user.lastName) {
        return true;
      }
    if (control == "mobile")
      if (this.myForm.controls["mobile"].value != this.user.mobile) {
        return true;
      }
    if (control == "email")
      if (this.myForm.controls["email"].value != this.user.email) {
        return true;
      }            
    return false;
 
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }    
}
