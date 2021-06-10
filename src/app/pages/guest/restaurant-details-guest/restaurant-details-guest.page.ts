import { Component, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AuthService } from './../../../services/auth.service';
import { ToastService } from './../../../services/toast.service';
import { AgmMap } from '@agm/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: 'app-restaurant-details-guest',
  templateUrl: './restaurant-details-guest.page.html',
  styleUrls: ['./restaurant-details-guest.page.scss'],
})
export class RestaurantDetailsGuestPage implements OnInit {

  @ViewChild('agmMap') agmMap : AgmMap;

  public restaurant: any;
  public lng: any;
  public lat: any;

  public postData = {
    id_rest: ''
  };

  public listBookings: any;

  public height: any;
  public id_user: any;
  public id_rest: any;

  public avaibleMap: boolean;
  public haveMenu: boolean;

  public postCreateBooking = {
    id: '',
    id_user: '',
    commensals: '',
    turns: '',
    time: ''
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socialSharing: SocialSharing,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private resolver: ComponentFactoryResolver,
    private firebaseAnalytics: FirebaseAnalytics,
    private platform: Platform
  ) { 

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id_user = window.localStorage.getItem('id_user');
        const state = this.router.getCurrentNavigation().extras.state;
        this.restaurant = state.item;
        if (typeof this.restaurant.restaurant_menu !== 'undefined' && this.restaurant.restaurant_menu  > 0){
          this.restaurant.restaurant_menu = JSON.parse(this.restaurant.restaurant_menu);
          this.haveMenu = true;
        }else{
          this.haveMenu = false;
        }

        if(!this.platform.is('mobileweb')){
          this.firebaseAnalytics.logEvent('page_view', {page: "Restaurant View: "+this.restaurant})
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
        }

        this.id_rest = this.restaurant.id;
        this.lat = parseFloat(this.restaurant.coords[0].lat);
        this.lng = parseFloat(this.restaurant.coords[0].lng);
        this.height = 300;
        this.avaibleMap = true;
      }
    });
  }

  ngOnInit() {
  
  }

  openMenu(){
    if(this.haveMenu){
      window.open("https://panel.booktable.app/storage/"+this.restaurant.restaurant_menu[0].download_link, '_system');
    }
  }

  ShareWhatsapp(){
    var img = "https://panel.booktable.app/storage/"+this.restaurant.images[0];
    if(this.haveMenu){
      console.log(this.haveMenu);
      var url = "https://panel.booktable.app/storage/"+this.restaurant.restaurant_menu[0].download_link;
      this.socialSharing.shareViaWhatsApp(this.restaurant.name, img, url);
    }else{
      this.socialSharing.shareViaWhatsApp(this.restaurant.name, img);
    }
  }

  back(){
    this.avaibleMap = false;
    this.restaurant = null;
    this.lng = null;
    this.lat = null;
  }

  profile(){
    this.router.navigate(['home/tabs/user-profile']);
  }

  async getBookingsByRestaurant(){
    this.authService.getBookingsByRestaurant(this.postData).subscribe(
      (res: any) => {
        this.listBookings = res;
      },
      (error: any) => {

      }
    )
  }

  createListBooking(){
    var arrayInputs = [];
    this.listBookings.forEach(element => {
      var object = {
        type: 'radio',
        label: 'Table for '+element.commensals+' personnes - '+element.turns,
        value: element
      }
      arrayInputs.push(object);
    });

    this.showPrompt(arrayInputs);
  }

  showPrompt(arrayInputs) {
    this.alertController.create({
      mode: 'ios',
      header: 'Réservation',
      message: 'Nombre de personnes',
      inputs: arrayInputs,
      buttons: [
        {
          text: 'Annuler',
          handler: (data: any) => {
          }
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            if(data.divisible_table == 1){
              this.showAlertDivisible(data);
            }else{
              this.showAlertNotDivisible(data);
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }


  showAlertNotDivisible(dataBooking){
    this.alertController.create({
      mode: 'ios',
      header: 'Réservation',
      subHeader: 'Actives booking',
      message: 'You have chosen a table for '+dataBooking.commensals+' persons. Are you sure you want it?',
      buttons: [
        {
          text: 'Annuler',
          handler: (data: any) => {
            
          }
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            this.createBooking(dataBooking.id, dataBooking.commensals);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  showAlertDivisible(dataBooking){
    var arrayInputs = [];
    for (let i = 1; i <= dataBooking.commensals; i++){
      var object = {
        type: 'radio',
        label: +i+' Persons',
        value: i
      }
      arrayInputs.push(object);
    }
    
    this.alertController.create({
      mode: 'ios',
      header: 'Réservation',
      message: 'Nombre de personnes',
      inputs: arrayInputs,
      buttons: [
        {
          text: 'Annuler',
          handler: (data: any) => {
            
          }
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            this.createBooking(dataBooking.id, data);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async createBooking(idBooking, commensals){
    this.postCreateBooking.id = idBooking;
    this.postCreateBooking.id_user = this.id_user;
    this.postCreateBooking.commensals = commensals;
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.authService.createBookingPetition(this.postCreateBooking).subscribe(
      (res: any) => {
        loading.dismiss();
        this.showAlert();
      },
      (error: any) => {
        this.toastService.presentToast('Error');
        loading.dismiss();
      }
    )
  }

  async showAlert(){
    this.alertController.create({
      mode: 'ios',
      header: 'Restaurant booking',
      subHeader: 'We will notify you when the restaurant has accepted your booking',
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
            
          }
        },
      ]
    }).then(res => {
      res.present();
    });
  }
}
