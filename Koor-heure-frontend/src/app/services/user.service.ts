import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserService {
    baseUrl: string = environment.api + '/user/admin';
    constructor(private http: HttpClient) { }

    getUsers(){
        return this.http.get(this.baseUrl);
    }
    getUser(email : string){
        return this.http.get(this.baseUrl + '/' + email);
    }

    patchUser(email: string, user: UserModel){
        return this.http.patch(this.baseUrl + '/'+ email,user);
    }
    createUser(user: UserModel) {
        return this.http.post(this.baseUrl, user);
    }

    deleteUser(email : string) {
        return this.http.delete(this.baseUrl + '/' + email);
    }
}
