import { IApiConfig } from "../_services/api.service";
import { MESSAGES_CONTAINER_ID } from "@angular/cdk/a11y";

export enum EApiConfigKeys  {
    message_title = "message_title", 
    message_text = "message_text", 
    delivery1 = "delivery1",
    delivery2 = "delivery2",
    delivery3 = "delivery3",
    address = "address", 
    email = "email", 
    phone = "phone", 
    latitude = "latitude", 
    longitude = "longitude",
    zoom = "zoom",
    timetable1 = "timetable1",
    timetable2= "timetable2",
    timetable3 = "timetable3"
  }

export class ConfigItem {
    id:number;
    key:string;
    value:string;
    created_at:string;
    updated_at:string;

    constructor(elem: IApiConfig) {
        if (elem !== null) {
            this.id = elem.id;
            this.key = elem.key;
            this.value = elem.value;
            this.created_at = elem.created_at;
            this.updated_at = elem.updated_at;
        } else {
            this.id = null;
        }
        console.log("Resulting brand: ");
        console.log(this);
    }     
    
}
export class Config {
    isLoaded : boolean = false;
    latitude : number;
    longitude: number;
    zoom : number;
    phone : string;
    address: string;
    email:string;
    timetable1:string;
    timetable2:string;
    timetable3:string;
    message_title : string;
    message_text : string;
    delivery1: number;
    delivery2:number;
    delivery3:number;
    message_updated : string;
    hasMessage : boolean;

    data : ConfigItem[] = [];
    constructor(items: ConfigItem[] = null) {
        console.log("in constructor");
        console.log(items);
        if (items != null) {
            for (let item of items ) {
                this.data.push(item);
            }
            this.latitude = parseFloat(this.get(EApiConfigKeys.latitude));
            this.longitude = parseFloat(this.get(EApiConfigKeys.longitude));
            this.zoom = parseInt(this.get(EApiConfigKeys.zoom));
            this.message_title = this.get(EApiConfigKeys.message_title);
            this.message_text = this.get(EApiConfigKeys.message_text);
            this.message_updated = this.get(EApiConfigKeys.message_text,"modified");
            this.delivery1 = parseFloat(this.get(EApiConfigKeys.delivery1));
            this.delivery2 = parseFloat(this.get(EApiConfigKeys.delivery2));
            this.delivery3 = parseFloat(this.get(EApiConfigKeys.delivery3));
            this.hasMessage  = (this.message_text!=null||this.message_title!=null)?true:false;  
            this.phone = this.get(EApiConfigKeys.phone);
            this.email = this.get(EApiConfigKeys.email);
            this.address = this.get(EApiConfigKeys.address);
            this.timetable1 = this.get(EApiConfigKeys.timetable1);
            this.timetable2 = this.get(EApiConfigKeys.timetable2);
            this.timetable3 = this.get(EApiConfigKeys.timetable3);
            this.isLoaded = true;  
        }
    }

    get(key: EApiConfigKeys, field="value") : string {
        let data = this.data.find(obj=>obj.key == key);
        if (!data) return null;
        if (field == "value")
            return data.value;
        if (field == "modified")
            return data.updated_at;    
    }


}
