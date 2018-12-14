import {IApiProduct, IApiBrand, IApiModel} from '../services/api.service';


export class Product {
    id : number;
    title: string;
    description:string;
    price:number;
    discount:number;
    brand: IApiBrand;
    model: IApiModel;


    constructor(product: IApiProduct) {
        if (product !== null) {
            this.id = product.id;
            this.title = product.title;
            this.description = product.description;
            this.price = product.price;
            this.discount = product.discount;
            this.brand = product.brand;
            this.model = product.model;
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