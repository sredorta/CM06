import {IApiProduct, IApiBrand, IApiModel, IApiImage, IApiAttachment, EApiImageSizes} from '../_services/api.service';


export class Product {
    id : number;
    title: string;
    description:string;
    price:number;
    discount:number;
    stock: number;
    isVehicle: boolean;
    brand: string;
    brand_url:string;
    model: string;
    brand_id: number;
    model_id: number;
    images: IApiAttachment[];


    constructor(product: IApiProduct) {
        if (product !== null) {
            this.id = product.id;
            this.title = product.title;
            this.description = product.description;
            this.price = isNaN(product.price)?0:product.price;
            this.discount = isNaN(product.discount)?0:product.discount;
            this.stock = product.stock;
            this.isVehicle = product.isVehicle;
            this.brand = product.brand;
            this.brand_url = product.brand_url;
            this.model = product.model;
            this.brand_id = product.brand_id;
            this.model_id = product.brand_id;
            this.images = product.images;
        } else {
            this.id = null;
        }
    }

    public getFinalPrice() {
        return this.price - this.discount;
    }

    public getImages(size: EApiImageSizes) {
        let result = [];
        for (let image of this.images) {
            result.push(image.sizes[size].url);
        }
        return result;
    }

}