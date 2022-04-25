import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl : string = environment.api;
  constructor(private http: HttpClient){

  }
  login(email : string, password:string){
      return this.http.post(this.baseUrl + '/auth/login',{email : email, password: password});
  }
  checkToken(){
      return this.http.get(this.baseUrl + '/token/check');
  }
}
