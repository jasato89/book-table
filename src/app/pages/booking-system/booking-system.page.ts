import { AbstractType, Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-booking-system',
  templateUrl: './booking-system.page.html',
  styleUrls: ['./booking-system.page.scss'],
})
export class BookingSystemPage implements OnInit {

  public postData = {
    id_user: '',
  }

  public postPetition = {
    id_petition: '',
  }

  public myActiveBookings: any;
  public myActivePetitions: any;
  
  public haveActiveBookings: boolean;
  public haveActivePetitions: boolean;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBookingsForBusinessUser();
    this.getBookingPetitions();

  }

  createBooking(){
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

  async getBookingPetitions(){
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.getBookingPetitions(this.postData).subscribe(
      (res: any) => {
        this.myActivePetitions = res;
        console.log(this.myActivePetitions);
        if(this.myActivePetitions.length == 0){
          this.haveActivePetitions = false;
        }else{
          this.haveActivePetitions = true;
        }
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
      }
    )
  }

  async getBookingsForBusinessUser(){
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.getBookingsForBusinessUser(this.postData).subscribe(
      (res: any) => {
        this.myActiveBookings = res;
        console.log(this.myActiveBookings);
        if(this.myActiveBookings.length == 0){
          this.haveActiveBookings = false;
        }else{
          this.haveActiveBookings = true;
        }
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
      }
    )
  }

  viewPetition(item){
    this.alertController.create({
      mode: 'ios',
      header: 'Restaurant Petition',
      subHeader: 'Do you want to accept the reservation request of this user?',
      buttons: [
        {
          text: 'No',
          handler: (data: any) => {
            this.cancelPetition(item);
          }
        },
        {
          text: 'Yes!',
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
        console.log(res);
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
        console.log(res);
        this.getBookingsForBusinessUser();
        this.getBookingPetitions();
      },
      (error: any) => {
        
      }
    )
  }

}
