//General form validators
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

//Validation messages that will appear on error
export class CustomValidators {
  constructor() { }

  //General error messages  
  static getMessages() {
      //We return the corresponding paramater to translate
      return [
        { type: 'required', message: 'validator.required' },
        { type: 'minlength', message: 'validator.minlength' },
        { type: 'maxlength', message: 'validator.maxlength' },
        { type: 'email', message: 'validator.email' },
        { type: 'validMobile', message: 'validator.validMobile' },   
        { type: 'areEqual', message: 'validator.areEqual' },
        { type: 'tooShortPassword', message: 'validator.tooShortPassword'},
        { type: 'validPassword', message: 'validator.validPassword' },
      ]

  }

  //Validate that mobile phone has correct number
  static validMobile(fc: FormControl){
    if (fc.value == null) return (null);  
    if (fc.value.length == 10) {
      var re = /^06[0-9]+/;
      if (fc.value.match(re)) {
        return (null);
      } 
      var re = /^07[0-9]+/;
      if (fc.value.match(re)) {
        return (null);
      }     

      return ({validMobile: true});
   }
  }

  //Validate that a checkbox is checked (usefull for terms and conditions for example)
  static isChecked(fc: FormControl) {
      if (fc.value == true) {
          return null;
      }
      return ({isChecked: true});
  }

  //Checks that all FormControls from a FormGroupName are equal
  // We use this to check password/confirm_password
  static areEqual(formGroup: FormGroup) {
    let value;
    let valid = true;
    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];

        if (value === undefined) {
          value = control.value
        } else {
          if (value !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) {
      return null;
    }
    return ({areEqual: true});
  }
  
  //Guarantees a minimum password quality
  static validPassword(fc: FormControl) {
    if (fc.value == null) {
        return(null)
    }
    if (fc.value.length < 5 ) 
      return({tooShortPassword : true})
    var re = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{5,}';
    if (fc.value.match(re)) {
        return (null);
    } else {
        return({validPassword : true})
    }

}


}

//State matcher class
/** Error when parent group has error this is used on confirm_password validation*/
export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return ((control.parent.invalid && isSubmitted) || (control.invalid && isSubmitted)) || (control.parent.invalid && control.touched && !isSubmitted);
  }
}