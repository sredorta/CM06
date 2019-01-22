import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators} from '../../_helpers/custom.validators';
import {ApiService, IApiLogin, IApiUserAuth} from '../../_services/api.service';
import { DataService } from '../../_services/data.service';
import { SpinnerOverlayService } from '../../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
import {Config, EApiConfigKeys} from '../../_models/config';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  myForm : FormGroup;
  validation_messages = CustomValidators.getMessages();
  config : Config = new Config(this.data.getConfig());
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api: ApiService, private data: DataService, private spinner: SpinnerOverlayService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.myForm =  new FormGroup({    
      message_title: new FormControl('', Validators.compose([
      ])),
      message_text: new FormControl('', Validators.compose([
      ])),
      delivery1: new FormControl('', Validators.compose([
        Validators.required,
        Validators.max(1000),
        Validators.min(1)
      ])), 
      delivery2: new FormControl('', Validators.compose([
        Validators.required,
        Validators.max(1000),
        Validators.min(1)
      ])),
      delivery3: new FormControl('', Validators.compose([
        Validators.required,
        Validators.max(1000),
        Validators.min(1)
      ])),
      address: new FormControl('', Validators.compose([
        Validators.minLength(5)
      ])),
      latitude: new FormControl('', Validators.compose([
        Validators.required
      ])),
      longitude: new FormControl('', Validators.compose([
        Validators.required
      ])),
      zoom: new FormControl('', Validators.compose([
        Validators.required,
        Validators.max(30),
        Validators.min(1)
      ])),      
      phone: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)
      ])),  
      email: new FormControl('', Validators.compose([
        Validators.email
      ])),  
      timetable1: new FormControl('', Validators.compose([
        Validators.required
      ])),        
      timetable2: new FormControl('', Validators.compose([
      ])),
      timetable3: new FormControl('', Validators.compose([
      ])),            
    });
    this.setValues();
  }
  setValues() {
    this.myForm.controls["message_title"].setValue(this.config.get(EApiConfigKeys.message_title));
    this.myForm.controls["message_text"].setValue(this.config.get(EApiConfigKeys.message_text));
    this.myForm.controls["delivery1"].setValue(this.config.get(EApiConfigKeys.delivery1));
    this.myForm.controls["delivery2"].setValue(this.config.get(EApiConfigKeys.delivery2));
    this.myForm.controls["delivery3"].setValue(this.config.get(EApiConfigKeys.delivery3));
    this.myForm.controls["address"].setValue(this.config.get(EApiConfigKeys.address));
    this.myForm.controls["latitude"].setValue(this.config.get(EApiConfigKeys.latitude));
    this.myForm.controls["longitude"].setValue(this.config.get(EApiConfigKeys.longitude));
    this.myForm.controls["zoom"].setValue(this.config.get(EApiConfigKeys.zoom));
    this.myForm.controls["phone"].setValue(this.config.get(EApiConfigKeys.phone));
    this.myForm.controls["email"].setValue(this.config.get(EApiConfigKeys.email));
    this.myForm.controls["timetable1"].setValue(this.config.get(EApiConfigKeys.timetable1));
    this.myForm.controls["timetable2"].setValue(this.config.get(EApiConfigKeys.timetable2));
    this.myForm.controls["timetable3"].setValue(this.config.get(EApiConfigKeys.timetable3));
  }

  resetForm() {
    this.myForm.reset();
    this.setValues();
  }

    //Highlight if we have modified the field
    isModified(control:string) {
      if (control == "message_title")
        if (this.myForm.controls["message_title"].value != this.config.get(EApiConfigKeys.message_title)) {
          return true;
        }
      if (control == "message_text")
        if (this.myForm.controls["message_text"].value != this.config.get(EApiConfigKeys.message_text)) {
          return true;
        }
      if (control == "delivery1")
        if (this.myForm.controls["delivery1"].value != this.config.get(EApiConfigKeys.delivery1)) {
          return true;
        }
      if (control == "delivery2")
        if (this.myForm.controls["delivery2"].value != this.config.get(EApiConfigKeys.delivery2)) {
          return true;
        }
      if (control == "delivery3")
        if (this.myForm.controls["delivery1"].value != this.config.get(EApiConfigKeys.delivery3)) {
          return true;
        }
      if (control == "address")
        if (this.myForm.controls["address"].value != this.config.get(EApiConfigKeys.address)) {
          return true;
        }
      if (control == "latitude")
        if (this.myForm.controls["latitude"].value != this.config.get(EApiConfigKeys.latitude)) {
          return true;
        } 
      if (control == "longitude")
        if (this.myForm.controls["longitude"].value != this.config.get(EApiConfigKeys.longitude)) {
          return true;
        }    
      if (control == "zoom")
        if (this.myForm.controls["zoom"].value != this.config.get(EApiConfigKeys.zoom)) {
          return true;
        }  
      if (control == "phone")
        if (this.myForm.controls["phone"].value != this.config.get(EApiConfigKeys.phone)) {
          return true;
        } 
      if (control == "email")
        if (this.myForm.controls["email"].value != this.config.get(EApiConfigKeys.email)) {
          return true;
        } 
      if (control == "timetable1")
        if (this.myForm.controls["timetable1"].value != this.config.get(EApiConfigKeys.timetable1)) {
          return true;
        }           
      if (control == "timetable2")
        if (this.myForm.controls["timetable2"].value != this.config.get(EApiConfigKeys.timetable2)) {
          return true;
        }  
      if (control == "timetable3")
        if (this.myForm.controls["timetable3"].value != this.config.get(EApiConfigKeys.timetable3)) {
          return true;
        }                                                 
      return false;
   
    }


  onSubmit(values) {
    console.log(values)
    if (this.myForm.invalid) {
      console.log("invalid");
      return;
    }
    this.spinner.show();
    this._subscriptions.push(this.api.setConfig(values).subscribe(res => {
      console.log("RESULT:");
      console.log(res);
      this.data.setConfig(res);
      //TODO get new config and update the this.data.setConfig
      this.spinner.hide();

    },()=>this.spinner.hide()));
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
