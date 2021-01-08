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

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute, 
    private router: Router,
  ) {

  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.getLikes();
    this.getRestaurantsFeatured();
    //console.log('ionViewWillEnter FIRST');
  }
 
  getLikes(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;
    this.authService.getLikes(this.postData).subscribe(
      (res: any) => {

        console.log(res);
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
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
    let navigationExtras: NavigationExtras = {
      state: {
        item: m
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

  getRestaurantsFeatured(){
    this.authService.getAllRestaurantsFeatures().subscribe(
      (res: any) => {
        this.restaurants_featured = res;
        this.restaurants_featured.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        console.log(this.restaurants_featured);
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
      }
    );
  }

}
