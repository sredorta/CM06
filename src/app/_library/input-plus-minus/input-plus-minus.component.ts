import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-plus-minus',
  templateUrl: './input-plus-minus.component.html',
  styleUrls: ['./input-plus-minus.component.scss']
})
export class InputPlusMinusComponent implements OnInit {
  @Input() parentForm : FormGroup;
  @Input() fieldName : string = "plusminus";
  @Input() default : number = 0;
  value : number;
  constructor() { }

  ngOnInit() {
    this.setFormField(this.default);
    this.parentForm.controls[this.fieldName].valueChanges.subscribe((res : number)=> {
      this.value = Number(res);
    });
    this.value = this.default;
  }
  //Sets the form field as specified in fieldName input
  setFormField(data) {
    var field = this.fieldName;
    var obj = {
      [field] : data
    };
    this.parentForm.patchValue(obj);
  }

  plus() {
    this.value = this.value + 1;
    this.setFormField(this.value);
  }
  minus() {
    this.value = this.value-1;
    if (this.value<0) this.value = 0;
    this.setFormField(this.value);
  }
}
