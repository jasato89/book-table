import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
  })
  export class HttpService {
    constructor(
      private http: HttpClient,
      ) {}
  
    auth(serviceName: string, data: any) {
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Content-Type':  'application/json'
      });
      const options = { headers: headers, withCredintials: false };
      const url = environment.apiUrl + serviceName;
  
      return this.http.post(url, JSON.stringify(data), options);
    }

    post(serviceName: string, data: any, token: any) {
      const headers = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +token
      });
      const options = { headers: headers, withCredintials: false };
      const url = environment.apiUrl + serviceName;
  
      return this.http.post(url, JSON.stringify(data), options);
    }

    get(serviceName: string, token: any){
      const headers = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
      const options = { headers: headers, withCredintials: true };
      const url = environment.apiUrl + serviceName;
  
      return this.http.get(url, options);
    }

    /** HTTP SERVICE - GUEST **/

    guestGet(serviceName: string){
      const headers = new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*',
        'Content-Type':  'application/json'
      });
      const options = { headers: headers, withCredintials: true };
      const url = environment.apiGuest + serviceName;
  
      return this.http.get(url, options);
    }

    guestPost(serviceName: string, data: any) {
      const headers = new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*',
        'Content-Type':  'application/json'
      });
      const options = { headers: headers, withCredintials: false };
      const url = environment.apiGuest + serviceName;
  
      return this.http.post(url, JSON.stringify(data), options);
    }

  }