import {Cart, CartItem } from "./cart";

export class Order {
    id : number;
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
    cart: Cart = new Cart();
    constructor() {
    }


}