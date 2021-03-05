import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Location } from "@angular/common";
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { AgmMap } from '@agm/core';



@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.page.html',
  styleUrls: ['./restaurant-details.page.scss'],
})
export class RestaurantDetailsPage implements OnInit {

  @ViewChild('agmMap') agmMap : AgmMap;

  public restaurant: any;
  public lng: any;
  public lat: any;

  public postData = {
    id_rest: ''
  };

  public _haveBooking: any;
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
    private transfer: FileTransfer,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private socialSharing: SocialSharing,
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { 

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id_user = window.localStorage.getItem('id_user');
        this.restaurant = this.router.getCurrentNavigation().extras.state.item;
        //console.log(this.restaurant);
        //console.log(this.restaurant.restaurant_menu.length);
        if(this.restaurant.restaurant_menu){
          this.restaurant.restaurant_menu = JSON.parse(this.restaurant.restaurant_menu);
          this.haveMenu = true;
        }else{
          this.haveMenu = false;
        }
        this.id_rest = this.restaurant.id;
        this.haveBooking();
      }
    });
  }


  //REINICIAR MAPA CUANDO ENTRA Y SALE DE UN RESTAURANTE Y ENTRA A OTRO.

  ngOnInit() {

  }

  openMenu(){
    window.open("https://panel.booktable.app/storage/"+this.restaurant.restaurant_menu[0].download_link, '_system');
  }

  ShareWhatsapp(){
    var img = "https://panel.booktable.app/storage/"+this.restaurant.images[0];
    console.log(url);
    if(this.haveMenu){
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

  async haveBooking(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.postData.id_rest = this.restaurant.id;
    this.authService.haveBooking(this.postData).subscribe(
      (res: any) => {
        this._haveBooking = res;
        console.log(this._haveBooking);
        if(this._haveBooking.length == 0){
          this._haveBooking = null;
        }
        this.getBookingsByRestaurant();
        this.lat = parseFloat(this.restaurant.coords[0].lat);
        this.lng = parseFloat(this.restaurant.coords[0].lng);
        this.height = 300;
        this.avaibleMap = true;
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
        loading.dismiss();
      }
    );
  }

  goToBooking(){
    let navigationExtras: NavigationExtras = {
      state: {
        item: this.restaurant
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details/booking'], navigationExtras);
  }

  async getBookingsByRestaurant(){
    this.authService.getBookingsByRestaurant(this.postData).subscribe(
      (res: any) => {
        console.log(res);
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
        label: 'Table for '+element.commensals+' Persons - '+element.turns,
        value: element
      }
      arrayInputs.push(object);
    });

    this.showPrompt(arrayInputs);
  }

  showPrompt(arrayInputs) {

    this.alertController.create({
      mode: 'ios',
      header: 'Restaurant booking',
      subHeader: 'Actives booking',
      message: 'Select the table that best suits your needs',
      inputs: arrayInputs,
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Done!',
          handler: (data: any) => {
            console.log('Selected Information', data);
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
      header: 'Restaurant booking',
      subHeader: 'Actives booking',
      message: 'You have chosen a table for '+dataBooking.commensals+' persons. Are you sure you want it?',
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            
          }
        },
        {
          text: 'Alright!',
          handler: (data: any) => {
            //CREAR PETICION
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
      header: 'Restaurant booking',
      subHeader: 'Actives booking',
      message: 'how many people go?',
      inputs: arrayInputs,
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            
          }
        },
        {
          text: 'Alright!',
          handler: (data: any) => {
            //CREAR PETICION
            this.createBooking(dataBooking.id, data);
            console.log(data);
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
        console.log(res);
        this.haveBooking();
        this.showAlert();
      },
      (error: any) => {
        this.toastService.presentToast('Error');
        this.haveBooking();
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
