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

  register(postData: any): Observable<any> {
    return this.httpService.auth('register', postData);
  }

  getUser(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('user', token);
  }

  update(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('update', data, token);
  }

  registerTokenDevice(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('registerTokenDevice', data, token);
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

  getLastRestaurants(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getLastRestaurants', data, token);
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

  getBookingsForBusinessUser(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingsForBusinessUser', data, token);
  }

  getMyRestaurants(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getMyRestaurants', data, token);
  }

  getBookingsByFavs(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingsByFavs', data, token);
  }

  getBookingsAll(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingsAll', data, token);
  }

  getBookingsByRestaurant(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingsByRestaurant', data, token);
  }

  createBookingPetition(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('createBookingPetition', data, token);
  }

  getBookingPetitions(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingPetitions', data, token);
  }

  acceptPetition(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('acceptPetition', data, token);
  }

  cancelPetition(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('cancelPetition', data, token);
  }
  
  hasArrived(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('hasArrived', data, token);
  }

  createBooking(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('createBooking', data, token);
  }
  

  logout() {
      localStorage.clear();
      window.localStorage.clear();
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("id_user");
      window.localStorage.removeItem("login");
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("name");
      window.localStorage.removeItem("last_name");
      window.localStorage.removeItem("email");

      this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'forward' });
  }

}