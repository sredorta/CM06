
import {IApiUserAuth, IApiAttachment, EApiImageSizes} from '../_services/api.service';

/*export enum avatarSizes  {
    full = 0, large = 1, big = 2, medium = 3, small = 4, thumbnail = 5, tinythumbnail = 6
  }*/

export class User {
    id : number;
    firstName:string;
    lastName:string;
    email:string;
    mobile:string;
    language:string;
    updated_at:string;
    created_at:string;
    account:string;   
    avatar:IApiAttachment;
/*    notifications:number;
    messages:number;
    roles:Array<String>;
    groups:Array<String>;
    avatar:any;*/
    constructor(user: IApiUserAuth) {
        if (user !== null) {
            this.id = user.id;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
            this.mobile = user.mobile;
            this.updated_at = user.updated_at;
            this.created_at = user.created_at;
            this.account = user.account;
            this.avatar = user.avatar;
/*            this.notifications = user.notifications;
            this.messages = user.messages;
            this.roles = user.roles;
            this.groups = user.groups;
            this.avatar = user.avatar;*/
        } else {
            this.id = null;
        }
        console.log("Resulting user: ");
        console.log(this);
    }

    //Returns if we have an user (i.e. we are logged in for current user!)
    isAvailable() :boolean {
        if ((this.id !== null) && (this.id !== undefined)) return true;
        return false;
    }
    
    isAdmin() :boolean {
        if (this.account == "Admin") return true;
        return false;
    }

    getAvatar() {
        if (this.avatar) {
            return "url(" + this.avatar.sizes["thumbnail"].url + ")";
        } else {
            return "url(./assets/images/userdefault.jpg)";
        }
    }

    /////////////////////////////////////////////////////////////////////////
    // Token related
    /////////////////////////////////////////////////////////////////////////
    public static removeToken() {
        localStorage.removeItem('jwt-token')
    }

    public static saveToken(token:string) {
        localStorage.setItem('jwt-token',token);
    }
    public static getToken() : string {
        return localStorage.getItem('jwt-token');
    }

    public static hasValidToken() : boolean {
        //Here we need to validate the token
        if (localStorage.getItem('jwt-token')== null) 
           return false;
        return true;
    }    
}