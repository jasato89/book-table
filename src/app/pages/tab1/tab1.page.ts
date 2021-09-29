import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  public restaurants_featured: any;
  private like: any;
  public id_user: any;
  public listEmpty: boolean = true;

  public postData = {
    id_user: ''
  };

  public postTopic = {
    topic: ''
  };

  public listTopic: any;
  public bookingsFavsList: any;
  public bookingAll: any;
  public bookingTotal: any;
  public lastRestaurants: any;
  public topRestaurants: any;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute, 
    private router: Router,
    private loadingController: LoadingController,
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics,
  ) {
    this.platform.resume.subscribe(() => {
      let token = window.localStorage.getItem('access_token');
      let role = window.localStorage.getItem('role');
      if(token){
        if(role == '2' || role == '1'){
          this.getBookingsAll();
          this.getBookingsTotal();
          this.getLastRestaurants();
        }
      }
    });
  }

  ngOnInit() {

  }

  doRefresh(event) {
    this.getRestaurantsByUserForRefresh(event);
  }

  private getRestaurantsByUserForRefresh(event): void{
      this.getBookingsAll();
      this.getBookingsTotal();
      this.getLastRestaurants();
      event.target.complete();
  }

  ionViewWillEnter() {
    this.getBookingsAll();
    this.getBookingsTotal();
    this.getLastRestaurants();
    this.getRestaurantsTops();
  }

  // Detecta cualquier cambio en la vista y lo registra.
  ionViewDidEnter(){
    if(!this.platform.is('mobileweb')){
      this.firebaseAnalytics.logEvent('page_view', {page: "Restaurants Views"})
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
    }
  }

  viewTopicCasual(){
    let navigationExtras: NavigationExtras = {
      state: {
        item: 'casual'
      }
    };
    this.router.navigate(['home/tabs/tabs1/restaurants-topics'], navigationExtras);
  }


  viewRestaurant(m){
    if(m.restaurant){
      m = m.restaurant;
    }
    
    let navigationExtras: NavigationExtras = {
      replaceUrl: true,
      state: {
        item: m
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

  goToBooking(m){
    if(m.restaurant){
      m = m.restaurant;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        item: m
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details/booking'], navigationExtras);
  }

  profile(){
    this.router.navigate(['home/tabs/user-profile'],{ replaceUrl: true });
  }

  getRestaurantsFeatured(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;

    this.authService.getAllRestaurantsFeatures(this.postData).subscribe(
      (res: any) => {
        this.restaurants_featured = res;
        this.restaurants_featured.forEach(element => {
          element.images = JSON.parse(element.images);
        });
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  getBookingsByFavs(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;

    this.authService.getBookingsByFavs(this.postData).subscribe(
      (res: any) => {
        this.bookingsFavsList = res;
        this.bookingsFavsList.forEach(element => {
          element.restaurant.images = JSON.parse(element.restaurant.images);
        });
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  getBookingsAll(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;

    this.authService.getBookingsAll(this.postData).subscribe(
      (res: any) => {
        this.bookingAll = res;
        this.listEmpty = this.checkEmptyList(this.bookingAll);
        console.log(this.listEmpty);
        if(this.listEmpty){
          this.bookingAll.forEach(element => {
            element.images = JSON.parse(element.images);
          });
        }
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  getBookingsTotal(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;

    this.authService.getBookingsTotal(this.postData).subscribe(
      (res: any) => {
        this.bookingTotal = res;
        this.listEmpty = this.checkEmptyList(this.bookingTotal);
        if(this.listEmpty){
          this.bookingTotal.forEach(element => {
            element.images = JSON.parse(element.images);
          });
        }
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  checkEmptyList(bookings){
    if(bookings && bookings.length > 0){
      return true;
    }else{
      return false;
    }
  }

  async getLastRestaurants(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });

    await loading.present();
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;

    this.authService.getLastRestaurants(this.postData).subscribe(
      (res: any) => {
        this.lastRestaurants = res;
        this.lastRestaurants.forEach(element => {
          element.images = JSON.parse(element.images);
          loading.dismiss();
        });
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
        loading.dismiss();
      }
    );

  }

  async getRestaurantsTops(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;

    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });

    await loading.present();
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;
    this.authService.getRestaurantsTopsList(this.postData).subscribe(
      (res: any) => {
        this.topRestaurants = res;
        this.topRestaurants.forEach(element => {
          element.images = JSON.parse(element.images);
          loading.dismiss();
        });
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
        loading.dismiss();
      }
    );

  }

}
