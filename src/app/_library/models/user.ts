
import {IApiUserAuth} from '../services/api.service';

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

/*    getAvatar(size:avatarSizes) : string {
        let avatar;
        switch (size) {
            case avatarSizes.full:
                avatar = this.avatar.full==null?null:this.avatar.full.url;
                break;
            case avatarSizes.big:
                avatar =  this.avatar.big==null?null:this.avatar.big.url;
                break;
            case avatarSizes.large:
                avatar = this.avatar.large==null?null:this.avatar.large.url;
                break;
            case avatarSizes.medium:
                avatar = this.avatar.medium==null?null:this.avatar.medium.url;
                break;
            case avatarSizes.small:
                avatar =  this.avatar.small==null?null:this.avatar.small.url;
                break;            
            case avatarSizes.thumbnail:
                avatar =  this.avatar.thumbnail==null?null:this.avatar.thumbnail.url;
                break;  
            case avatarSizes.tinythumbnail:
                avatar = this.avatar.tinythumbnail==null?null:this.avatar.tinythumbnail.url;
                break; 
            default:
                avatar =  this.avatar.medium.url;
        }
        if (avatar == null) avatar = this.avatar.full.url; //Case of default
        return "url(" + avatar + ")";
    }*/

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