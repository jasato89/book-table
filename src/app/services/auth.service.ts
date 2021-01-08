import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { NavController } from '@ionic/angular';

@Injectable({
providedIn: 'root'
})
  export class AuthService {
  userData$ = new BehaviorSubject<any>([]);

  constructor(
    private httpService: HttpService,
    private navCtrl: NavController
  ) {}

  login(postData: any): Observable<any> {
    return this.httpService.auth('login', postData);
  }

  getUser(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('user', token);
  }

  getAllRestaurantsFeatures(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('getAllRestaurantsFeatures', token);
  }

  getAllRestaurants(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('getAllRestaurants', token);
  }

  getCitysFromRestaurants(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('getCitysFromRestaurants', token);
  }

  getBookings(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookings', data, token);
  }

  getLikes(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getLikes', data, token);
  }

  getOneLike(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getOneLike', data, token);
  }

  setLikeRestaurant(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('setLikeRestaurant', data, token);
  }

  getWishesByUser(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getWishesByUser', data, token);
  }

  haveBooking(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('haveBooking', data, token);
  }

  storetWishByUser(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('storetWishByUser', data, token);
  }

  deleteWishByUser(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('deleteWishByUser', data, token);
  }

  listingTopics(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('listingTopics', data, token);
  }

  getBookingActive(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingActive', data, token);
  }

  getsBookingsByUser(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getLastsBookings', data, token);
  }
  
  /******/ 
  getPartner(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getPartner', data, token);
  }

  /******/ 

  logout() {
      localStorage.clear();
      window.localStorage.clear();
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("id_user");
      window.localStorage.removeItem("login");
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("name");
      window.localStorage.removeItem("last_name");

      this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'forward' });
  }

}