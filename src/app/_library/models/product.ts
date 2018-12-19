import {IApiProduct, IApiBrand, IApiModel, IApiImage, IApiAttachment} from '../services/api.service';


export class Product {
    id : number;
    title: string;
    description:string;
    price:number;
    discount:number;
    brand: string;
    model: string;
    brand_id: number;
    model_id: number;
    images: IApiAttachment[];


    constructor(product: IApiProduct) {
        if (product !== null) {
            this.id = product.id;
            this.title = product.title;
            this.description = product.description;
            this.price = product.price;
            this.discount = product.discount;
            this.brand = product.brand;
            this.model = product.model;
            this.brand_id = product.brand_id;
            this.model_id = product.brand_id;
            this.images = product.images;
        } else {
            this.id = null;
        }
        console.log("Resulting product: ");
        console.log(this);
    }

    public getFinalPrice() {
        return this.price - this.discount;
    }
    //Returns if we have an user (i.e. we are logged in for current user!)
    public isAvailable() :boolean {
        if ((this.id !== null) && (this.id !== undefined)) return true;
        return false;
    }

}