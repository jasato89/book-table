import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { NavController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Injectable({
providedIn: 'root'
})
  export class AuthService {
  userData$ = new BehaviorSubject<any>([]);

  constructor(
    private httpService: HttpService,
    private navCtrl: NavController,
    private fb: Facebook
  ) {}

  /** Guest API Calls */

  getBookingsAllGuest(data: any): Observable<any>{
    return this.httpService.guestPost('getBookingsAll', data);
  }

  getLastRestaurantsGuest(data: any): Observable<any>{
    return this.httpService.guestPost('getLastRestaurants', data);
  }


  /** Auth API Calls */

  login(postData: any): Observable<any> {
    return this.httpService.auth('login', postData);
  }

  loginFacebook(postData: any): Observable<any> {
    return this.httpService.auth('login-facebook', postData);
  }

  loginApple(postData: any): Observable<any> {
    return this.httpService.auth('login-apple', postData);
  }

  register(postData: any): Observable<any> {
    return this.httpService.auth('register', postData);
  }

  registerBusiness(postData: any): Observable<any> {
    return this.httpService.auth('register-business', postData);
  }

  getUser(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('user', token);
  }

  update(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('update', data, token);
  }

  resetPassword(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('forget-password', data, token);
  }

  registerTokenDevice(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('registerTokenDevice', data, token);
  }

  /** Common API Calls GET **/

  getAllRestaurantsFeatures(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getAllRestaurantsFeatures', data, token);
  }

  getAllRestaurants(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getAllRestaurants', data, token);
  }

  getCitysFromRestaurants(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('getCitysFromRestaurants', token);
  }

  getRestaurantsTops(): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.get('getRestaurantsTops', token);
  }

  getRestaurantsTopsList(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getRestaurantsTopsList', data, token);
  }
  
  /** Common API Calls POST **/

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

  getBookingsTotal(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getBookingsTotal', data, token);
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

  getLastBookingsUserBusiness(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('getLastBookingsUserBusiness', data, token);
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

  deleteBooking(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('deleteBooking', data, token);
  }
  
  hasPaymentMethod(data: any): Observable<any>{
    let token = window.localStorage.getItem('access_token');
    return this.httpService.post('hasPaymentMethod', data, token);
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

      this.fb.logout().then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });

      this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'forward' });
  }

}