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

  public postData2 = {
    email: '',
    name: '',
    id: '',
    phone_number: ''
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
  public phone: any;


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

  back(){
    let navigationExtras: NavigationExtras = {
      replaceUrl: true,
      state: {
        item: this.restaurant
      }
    };
    this.router.navigate(['home/tabs/tab1'], navigationExtras);
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
        label: 'Table pour max'+element.commensals+' personnes - '+element.turn_text,
        value: element
      }
      arrayInputs.push(object);
    });

    this.bookingSelect = arrayInputs[0].value;

    this.showPrompt(arrayInputs)
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
            console.log(arrayInputs);
            if(arrayInputs.length == 1){
              data = arrayInputs[0].value;
            }
            console.log('Selected Information', data);
            this.table = 'Table pour max '+data.commensals+' personnes - '+data.turn_text;
            this.bookingSelect = data;
            this.time = null;
            if(data.divisible_table == 1){
              this.divisible = 1;
              this.commensals = 0;
              if (data.commensals > 1) {
                this.showAlertDivisible();
              }
              else{
                this.commensals = data.commensals;
              }
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
        label: +i+' personnes',
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
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    const usuario = this.authService.getUser().subscribe(
      async (res: any) => {

        if (res.phone_number == null) {
          const phone = this.showAlertPhone(res);
        }

      },(error: any) => {
        this.toastService.presentToast('Error');
        loading.dismiss();
      }
    );
    this.postCreateBooking.id = this.bookingSelect.id;
    this.postCreateBooking.id_user = this.id_user;
    this.postCreateBooking.commensals = this.commensals;
    this.postCreateBooking.time = this.time;
    
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
      //subHeader: 'Nous vous enverrons une notification lorsque votre réservation sera acceptée par le restaurant.',
      subHeader: 'Votre réservation a été effectuée',
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

  async showAlertPhone(user){

    let prompt = this.alertController.create({
      mode: 'ios',
      header: 'Téléphone',
      message: "Vous devez avoir un numéro de téléphone de contact dans votre nom d'utilisateur",
      inputs: [
        {
          name: 'Phone',
          placeholder: 'Numéro de téléphone...',
          type: 'tel',
        },
      ],
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
            this.phonenumber(data)
            // if (data == false) {
            //   this.alertController.create(
            //     { message: 'Your input is invalid. Description is missing.', buttons: [{ text: 'OK' }] }
            //   );
            //   return;
            // }

            this.postData2.phone_number = data.Phone; 
            this.postData2.id = user.id;
            this.postData2.email = user.email;
            this.postData2.name = user.name;
            console.log(this.postData2)

            this.authService.update(this.postData2).subscribe(
              (res: any) => {

                console.log('Correcto');

              }
            );
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
  async phonenumber(inputtxt) {
    var phoneno = '/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/';
    if((inputtxt.value.match(phoneno))){
        return true;
    }else {
        return false;
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
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

}
