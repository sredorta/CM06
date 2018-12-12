
import {IApiBrand, EApiImageSizes, IApiImage} from '../_library/services/api.service';


/*  export interface IApiBrand {
    id:number;
    name:string;
    description:string;
    image: IApiImage;
  }
  
  export interface IApiImage {
    url:string;
    size: EApiImageSizes;
    with:number;
    height:number;
    file_size:number;
    alt_text:string;
    title:string;
    description:string;
  }*/


export class Brand {
    id : number;
    name:string;
    description:string;
    image: IApiImage;
 
    constructor(brand: IApiBrand) {
        if (brand !== null) {
            this.id = brand.id;
            this.name = brand.name;
            this.image = brand.image;
        } else {
            this.id = null;
        }
        console.log("Resulting brand: ");
        console.log(this);
    }

}