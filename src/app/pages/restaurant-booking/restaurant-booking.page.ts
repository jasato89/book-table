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
  selector: 'app-restaurant-booking',
  templateUrl: './restaurant-booking.page.html',
  styleUrls: ['./restaurant-booking.page.scss'],
})
export class RestaurantBookingPage implements OnInit {

  public postCreateBooking = {
    id: '',
    id_user: '',
    commensals: '',
    time: ''
  }

  public postData = {
    id_rest: ''
  };

  public id_user: any;
  public restaurant: any;

  public listBookings: any;
  public bookingSelect: any;

  public table: any;
  public turn: any;
  public divisible: any;
  public commensals: any;
  public time: any;


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
        this.postData.id_rest = this.restaurant.id;
        this.getBookingsByRestaurant();
      }
    });
  }

  ngOnInit() {
  }

  async getBookingsByRestaurant(){
    this.authService.getBookingsByRestaurant(this.postData).subscribe(
      (res: any) => {
        this.listBookings = res;
        this.listBookings.forEach(element => {
          if(element.turns == 1){
            element.turn_text = "Midi";
          }else{
            element.turn_text = "Soir";
          }
        });
        console.log(this.listBookings);
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
        label: 'Table pour '+element.commensals+' personnes - '+element.turn_text,
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
      message: 'Choisis la table que tu préfères',
      inputs: arrayInputs,
      buttons: [
        {
          text: 'Annuler',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            this.table = 'Table pour '+data.commensals+' personnes - '+data.turn_text;
            this.bookingSelect = data;
            this.time = null;
            console.log('Selected Information', data);
            if(data.divisible_table == 1){
              this.divisible = 1;
              this.commensals = 0;
              this.showAlertDivisible();
            }else{
              this.commensals = data.commensals;
              this.divisible = 0;
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  showAlertDivisible(){
    var arrayInputs = [];
    for (let i = 1; i <= this.bookingSelect.commensals; i++){
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
            this.commensals = data;
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async createBooking(){
    this.postCreateBooking.id = this.bookingSelect.id;
    this.postCreateBooking.id_user = this.id_user;
    this.postCreateBooking.commensals = this.commensals;
    this.postCreateBooking.time = this.time;
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
      header: 'Demande de réservation',
      subHeader: 'Nous vous enverrons une notification lorsque votre réservation sera acceptée par le restaurant.',
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
            this.location.back();
          }
        },
      ]
    }).then(res => {
      res.present();
    });
  }

}