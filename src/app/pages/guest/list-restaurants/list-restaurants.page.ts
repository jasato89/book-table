import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { ToastService } from './../../../services/toast.service';
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.page.html',
  styleUrls: ['./list-restaurants.page.scss'],
})
export class ListRestaurantsPage implements OnInit {

  public restaurants_featured: any;
  public listEmpty: boolean;

  public postData = {
    id_user: ''
  };

  public postTopic = {
    topic: ''
  };

  public listTopic: any;
  public bookingsFavsList: any;
  public bookingAll: any;
  public lastRestaurants: any;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute, 
    private router: Router,
    private loadingController: LoadingController,
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics,
    ) { }

  ngOnInit() {
  }

  doRefresh(event) {
    this.getRestaurantsByUserForRefresh(event);
  }

  private getRestaurantsByUserForRefresh(event): void{
      this.getBookingsAll();
      this.getLastRestaurants();
      event.target.complete();
  }

  ionViewWillEnter() {
    this.getBookingsAll();
    this.getLastRestaurants();
    
    if(!this.platform.is('mobileweb')){
      this.firebaseAnalytics.logEvent('page_view', {page: "Restaurants Views"})
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
    }
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
    this.router.navigate(['/restaurant-details-guest'], navigationExtras);
  }


  getBookingsAll(){
    this.authService.getBookingsAllGuest(this.postData).subscribe(
      (res: any) => {
        console.log(res);
        this.bookingAll = res;
        this.listEmpty = this.checkEmptyList(this.bookingAll);
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
    this.authService.getLastRestaurantsGuest(this.postData).subscribe(
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


}
