import {Product} from './product';

export class CartItem {
    id:number;
    quantity:number;

    constructor(elem: any) {
        if (elem !== null) {
            this.id = elem.id;
            this.quantity = elem.quantity;
        } else {
            this.id = null;
        }
        console.log("Resulting brand: ");
        console.log(this);
    }     
    
}
export class Cart {
    data : CartItem[] = [];

 
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

    //Gets count of the session cart
    public static getCount() {
        let cart = new Cart(null);
        cart.fromStorage();
        console.log("RETURNING COUNT : " + cart.getCount());
        return cart.getCount();
    }

    private _toJSON() {
        return JSON.stringify(this.data);
    }

    private _fromJSON(obj:string) {
        console.log("fromJSON");
        console.log(JSON.parse(obj));
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



}