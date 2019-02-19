import {Cart, CartItem } from "./cart";
import {IApiOrder} from '../_services/api.service';

export class Order {
    id : number;
    user_id:number;
    firstName:string;
    lastName:string;
    email:string;
    mobile:string;
    delivery:boolean;
    address1:string;
    address2:string;
    cp:string;
    city:string;
    total:number;
    paypalOrderId:string;
    paypalPaymentId:string;
    status:string;
    tracking:string;
    created_at:string;
    updated_at:string;
    cart: Cart = new Cart();
    constructor(data:IApiOrder = null) {
        if (data != null) {
            this.id = data.id;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.email = data.email;
            this.mobile = data.mobile;
            this.delivery = data.delivery;
            this.address1 = data.address1;
            this.address2 = data.address2;
            this.cp = data.cp;
            this.city = data.city;
            this.total = data.total;
            this.paypalOrderId = data.paypalOrderId;
            this.paypalPaymentId = data.paypalPaymentId;
            this.status = data.status;
            this.tracking = data.tracking;
            let cart = new Cart();
            cart.fromJSON(data.cart.toString());
            this.cart = cart;
            this.created_at = data.created_at;
            this.updated_at = data.updated_at;
        }
    }


}