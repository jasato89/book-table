import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {

  public name: any;
  public last_name: any;
  public activeRests: any;
  public segment: any;
  public lastBookings: any;
  public role: any;

  public haveData: boolean;
  public haveLastsRecords: boolean;

  public isUser: boolean;
  public isBusiness: boolean;

  public postData = {
    id_user: ''
  };

  constructor(
    public modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.name = window.localStorage.getItem('name');
    this.last_name = window.localStorage.getItem('last_name');
    this.setRole();
    this.getBooking();
  }
  
  setRole(){
    this.role = window.localStorage.getItem('role');
    this.isUser = false;
    this.isBusiness = false;

    switch(this.role){
      case "2":
        this.isUser = true;
        break;
      case "3":
        this.isBusiness = true;
        break;
      default:
        this.isUser = true;
        break;
    }
  }

  viewRestaurant(item){
    this.infoBooking(item);
  }

  async infoBooking(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Info!',
      subHeader: 'the date of your booking: '+item.time_trame,
      message: 'Try to arrive on time!',
      buttons: ['OK']
    });

    await alert.present();
  }


  async getBooking(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.getBookingActive(this.postData).subscribe(
      (res: any) => {
        this.activeRests = res;
        this.activeRests.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        if(this.activeRests.length == 0){
          this.haveData = false;
        }else{
          this.haveData = true;
        }
        this.getLastsBookings();
        this.segment = 'active';
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
        loading.dismiss();
      }
    );

  }

  async getLastsBookings(){

    this.authService.getsBookingsByUser(this.postData).subscribe(
      (res: any) => {

        this.lastBookings = res;
        this.lastBookings.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        if(this.lastBookings.length == 0){
          this.haveLastsRecords = false;
        }else{
          this.haveLastsRecords = true;
        }

       
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
      }
    )
  }

  logout(){
    this.authService.logout();
  }

}
