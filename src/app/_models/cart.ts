import {Product} from './product';

export class CartItem {
    id:number;
    title:string;
    price:number;
    stock:number;
    weight:number;
    url:string;
    quantity:number;
    tprice:number;

    constructor(elem: any) {
        if (elem !== null) {
            this.id = elem.id;
            this.title = elem.title;
            this.price = elem.price;
            this.stock = elem.stock;
            this.weight = elem.weight;
            this.url = elem.url;
            this.quantity = elem.quantity;
            this.tprice = elem.tprice;
        } else {
            this.id = null;
        }
    }     
    
}

export class Cart {
    data : CartItem[] = [];
    price:number;
    isWeightExceeded:boolean;
    deliveryCost:number;
    
    constructor(items: CartItem[] = null) {
        if (items != null)
            for (let item of items ) {
                this.data.push(item);
            }
    }

    //Add item to the cart, if already in the cart we update it as it could change the quantity
    add(item:CartItem) {
        let index = this.data.findIndex(obj => obj.id == item.id);
        if (index>=0) {
            this.data[index] = item;
        } else {
            this.data.push(item);
        }
        //Update the storage
        this.toStorage();
    }

    //Remove item from the cart
    remove(item:CartItem) {
        let index = this.data.findIndex(obj => obj.id == item.id);
        if (index>=0) {
            this.data.splice(index,1);
        }
        //Update the storage
        this.toStorage();
    }

    //Empty the cart    
    empty() {
        this.data = [];
        this.toStorage();
    }

    //Get elements count
    getCount() : number {
        return this.data.length;
    }


    private _toJSON() {
        return JSON.stringify(this.data);
    }

    private _fromJSON(obj:string) {
        this.data  = []
        for (let item of JSON.parse(obj)) {
            this.data.push(new CartItem(item));
        }
    }

    //Saves cart to session Storage
    toStorage() {
        sessionStorage.setItem("cart", this._toJSON());
    }

    //Initializes object from sessionStorage
    fromStorage() {
        if (sessionStorage.getItem("cart") != null) {
            this._fromJSON(sessionStorage.getItem("cart"))
        } else {
            this.data = [];
        }
    }

    //Calculates the weight of the cart
    getWeight() {
        let weight = 0;
        for (let item of this.data) {
            console
            weight = weight + (item.quantity*item.weight);
        }
        return weight;
    }


}