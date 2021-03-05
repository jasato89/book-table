import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActionSheetController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  public restaurants_featured: any;

  public id_user: any;

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
  ) {

  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    //this.getLikes();
    this.getRestaurantsFeatured();
    this.getBookingsByFavs();
    this.getBookingsAll();
    this.getLastRestaurants();
    //console.log('ionViewWillEnter FIRST');
  }
 
  getLikes(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;
    this.authService.getLikes(this.postData).subscribe(
      (res: any) => {

      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  viewTopicCasual(){
    let navigationExtras: NavigationExtras = {
      state: {
        item: 'casual'
      }
    };
    this.router.navigate(['home/tabs/tabs1/restaurants-topics'], navigationExtras);
  }

  viewTopicExotic(){

  }

  viewTopicBuffet(){

  }

  viewRestaurant(m){

    if(m.restaurant){
      m = m.restaurant;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        item: m
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

  profile(){
    this.router.navigate(['home/tabs/user-profile']);
  }

  getRestaurantsFeatured(){
    this.authService.getAllRestaurantsFeatures().subscribe(
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

        console.log(this.bookingsFavsList);
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
        this.bookingAll.forEach(element => {
          element.images = JSON.parse(element.images);
        });
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
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

}
