import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'niceDateFormat'
})
export class NiceDateFormatPipe implements PipeTransform {
  transform(value: string) {  
    var _value = new Date(value).getTime();
    var dif = Math.floor( ( (Date.now() - _value) / 1000 ) / 86400 );
    if ( dif < 30 ){
         return convertToNiceDate(value);
    } else{
        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(value, 'dd-MMM-yyyy');
        return value;
    }
 }

}
function convertToNiceDate(time: string) {
  var date = new Date(time),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      daydiff = Math.floor(diff / 86400);
  if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31) {
    var datePipe = new DatePipe("en-US");
    let value = datePipe.transform(time, 'dd-MMM-yyyy');
    return value;  
  }
   //   return '';

  return daydiff == 0 && (
      diff < 60 && "Maintenant" ||
      diff < 120 && "Il y a 1 minute" ||
      diff < 3600 && "Il y a " + Math.floor(diff / 60) + " minutes" ||
      diff < 7200 && "Il y a 1 heure" ||
      diff < 86400 && "Il y a " + Math.floor(diff / 3600) + " heures") ||
      daydiff == 1 && "Hier" ||
      daydiff < 7 && "Il y a " + daydiff + " jours" ||
      daydiff < 31 && "Il y a " + Math.ceil(daydiff / 7) + " semaine(s)";
}