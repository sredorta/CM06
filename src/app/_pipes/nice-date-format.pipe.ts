import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'niceDateFormat'
})
export class NiceDateFormatPipe implements PipeTransform {

  result : string = "";
  constructor(private translate: TranslateService) {}



  transform(value: string) {  
    var _value = new Date(value).getTime();
    var dif = Math.floor( ( (Date.now() - _value) / 1000 ) / 86400 );
    if ( dif < 30 ){
      let result = convertToNiceDate(value).split(",");
      let subscription = this.translate.get(result[0],{count : result[1]}).subscribe((trans) => {
        this.result = trans;
      });
      subscription.unsubscribe();
    } else{
        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(value, 'dd-MMM-yyyy');
        this.result = convertToNiceDate(value);
    }
    return this.result;
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

  return  daydiff == 0 && (
      diff < 60 && "dateformat.now" ||
      diff < 120 && "dateformat.minutesago.one" ||
      diff < 3600 && "dateformat.minutesago.more," + Math.floor(diff / 60)  ||
      diff < 7200 && "dateformat.hoursago.one" ||
      diff < 86400 && "dateformat.hoursago.more," + Math.floor(diff / 3660)) ||
      daydiff == 1 && "dateformat.yesterday" ||
      daydiff < 7 && "dateformat.daysago.more," + daydiff  ||
      daydiff < 31 && "dateformat.weeksago.more," + Math.ceil(daydiff / 7) ;

}