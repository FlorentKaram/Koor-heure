import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    //const token = localStorage.access_token; // you probably want to store it in localStorage or something
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('access_token');
      const isApiUrl = httpRequest.url.startsWith(environment.api);
      if(token && isApiUrl){
        httpRequest = httpRequest.clone({
          setHeaders : {Authorization: `Bearer ${token}`}
        })
      }
      return next.handle(httpRequest);
    }
}