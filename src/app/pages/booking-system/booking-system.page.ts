import { AbstractType, Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-booking-system',
  templateUrl: './booking-system.page.html',
  styleUrls: ['./booking-system.page.scss'],
})
export class BookingSystemPage implements OnInit {

  public p2: 0;

  public postData = {
    id_user: '',
  }

  public postPetition = {
    id_petition: '',
  }

  public myActiveBookings: any;
  public myActivePetitions: any;
  public myLastBookings: any;
  public havePaymentMethod: any;
  
  public haveActiveBookings: boolean;
  public haveActivePetitions: boolean;
  public haveLastBookings: boolean;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private safariViewController: SafariViewController,
    private inAppBrowser: InAppBrowser
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.hasPaymentMethod();
    this.getBookingsForBusinessUser();
    this.getBookingPetitions();
    this.getLastBookingsUserBusiness();
  }

  createBooking(){
    var prueba = window.matchMedia('(prefers-color-scheme: white)').matches;
    console.log('Modo oscuro? : ',prueba);
    this.router.navigate(['home/tabs/booking-system/booking-create']);
  }

  modifyBooking(item){
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.router.navigate(['home/tabs/booking-system/booking-details'], navigationExtras);
  }

  convertDateForIos(date) {
    var arr = date.split(/[. :]/);
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);

    var dateStr =
          ("00" + date.getDate()).slice(-2) + "/" +
          ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          date.getFullYear() + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2);

    return dateStr;
  }

  async hasPaymentMethod(){
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.hasPaymentMethod(this.postData).subscribe(
      (res: any) =>{
        this.havePaymentMethod = res;
      }
    )
  }

  async getBookingPetitions(){
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.getBookingPetitions(this.postData).subscribe(
      (res: any) => {
        this.myActivePetitions = res;
        if(this.myActivePetitions.length == 0){
          this.haveActivePetitions = false;
        }else{
          this.haveActivePetitions = true;
          this.myActivePetitions.forEach(element => {
            var date = this.convertDateForIos(element.time_trame);
            element.time_trame = date;
          });
        }
      },
      (error: any) => {
        this.toastService.presentToast('Probl??me de r??seau.');
      }
    )
  }

  async getBookingsForBusinessUser(){
    this.postData.id_user = window.localStorage.getItem('id_user');
    console.log("Antes de obtener las reservas.");
    console.log(window.localStorage.getItem('id_user'));
    this.authService.getBookingsForBusinessUser(this.postData).subscribe(
      (res: any) => {
        this.myActiveBookings = res;
        console.log("Antes de recorrer una reserva"); 
        this.myActiveBookings.forEach(element => {

          var hoy = new Date();//Fecha actual del sistema
          var fechaFormateada = element.created_at;
          var fechaHoy = hoy.toLocaleDateString("en-CA");
          var fechaFinal = fechaFormateada.slice(0, 10);
          
          console.log(fechaFinal !== fechaHoy)
          console.log(fechaFinal)
          console.log(fechaHoy)
          
          
          // if (fechaFinal == fechaHoy) {
          //   element.fechaFormat = 0;
          // }else {
            //   element.fechaFormat = 1;
            //   if(element.pending == 1){
              //     element.pending_text = "En attente";
              //   }
              // }
              
          

          if(element.pending == 1 && fechaFinal == fechaHoy){

            element.fechaFormat = 3;
            element.pending_text = "En attente";
            
          }else if(element.pending == 1 && fechaFinal > fechaHoy){
            
            element.pending_text = "Non R??serv??e";
            element.fechaFormat = 1;

          }else if(element.pending == 0 && fechaFinal == fechaHoy){

            element.pending_text = "R??serv??e";
            element.fechaFormat = 0;

          }else{

            element.pending_text = "R??serv??e";
            element.fechaFormat = 1;

          }

          if(element.turns == 1){
            element.turn_text = "Midi";
          }else{
            element.turn_text = "Soir";
          }

        });
    console.log(this.myActiveBookings);
        
        console.log("Despues de recorrer una reserva"); 
        if(this.myActiveBookings.length == 0){
          this.haveActiveBookings = false;
        }else{
          this.haveActiveBookings = true;
        }

        this.myActiveBookings = this.myActiveBookings.sort(function (a, b) {
          return b.id - a.id });
          
      },
      (error: any) => {
        this.toastService.presentToast('Probl??me de r??seau.');
      }
    )
    console.log(this.myActiveBookings);
    console.log("Despues de obtener las reservas.");
  }

  async getLastBookingsUserBusiness(){
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.getLastBookingsUserBusiness(this.postData).subscribe(
      (res: any) => {
        this.myLastBookings = res;
        if(this.myLastBookings){
          if(this.myLastBookings.length == 0){
            this.haveLastBookings = false;
          }else{
            this.haveLastBookings = true;
          }
        }
        
      },
      (error: any) => {
        this.toastService.presentToast('Probl??me de r??seau.');
      }
    )
  }

  viewPetition(item){
    this.alertController.create({
      mode: 'ios',
      header: 'Nouvelle demande de r??servation',
      subHeader: 'Voulez-vous accepter la r??servation de ce client ?',
      buttons: [
        {
          text: 'Non',
          handler: (data: any) => {
            this.cancelPetition(item);
          }
        },
        {
          text: 'Oui',
          handler: (data: any) => {
            //CREAR PETICION
            this.acceptPetition(item);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async acceptPetition(item){
    this.postPetition.id_petition = item.id;
    this.authService.acceptPetition(this.postPetition).subscribe(
      (res: any) => {
        this.getBookingsForBusinessUser();
        this.getBookingPetitions();
      },
      (error: any) => {
        
      }
    )
  }

  async cancelPetition(item){
    this.postPetition.id_petition = item.id;
    this.authService.cancelPetition(this.postPetition).subscribe(
      (res: any) => {
        this.getBookingsForBusinessUser();
        this.getBookingPetitions();
      },
      (error: any) => {
        
      }
    )
  }

  goToPanel(){
    this.safariViewController.isAvailable().then((available: boolean) => {
      if (available) {
          this.safariViewController.show({
            url: 'https://panel.booktable.app/admin/',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#00ba5c'
          })
          .subscribe((result: any) => {
              if(result.event === 'opened') console.log('Opened');
              else if(result.event === 'loaded') console.log('Loaded');
              else if(result.event === 'closed') console.log('Closed');
            },
            (error: any) => console.error(error)
          );

        } else {
          // Opening a URL and returning an InAppBrowserObject
          const browser = this.inAppBrowser.create('https://panel.booktable.app/admin/', '_system', 'location=yes');
        }
      }
    );
  }

}
