import { AbstractType, Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

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
  public myActiveBookings: any;
  public role: any;

  public haveData: boolean;
  public haveLastsRecords: boolean;
  public haveActiveBookings: boolean;

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
    private router: Router,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.name = window.localStorage.getItem('name');
    this.last_name = window.localStorage.getItem('last_name');
    this.setRole();
  }
  
  setRole(){
    this.role = window.localStorage.getItem('role');
    this.isUser = false;
    this.isBusiness = false;

    switch(this.role){
      case "2":
        this.isUser = true;
        this.getBooking();
        break;
      case "3":

        break;
      default:
        this.isUser = true;
        this.getBooking();
        break;
    }

  }

async ShareFacebook(item ){
    var text = "I have a booking in "+item.name+" restaurant thanks to BookTable!";
    var logo = "https://booktable.app/wp-content/uploads/2020/12/LOGO-02.svg";
    var website = "https://booktable.app/";
    
    let shareRet = await Share.share({
      title: "BookTable - Booking",
      text: text,
      url: website,
      dialogTitle: 'Share'
    });

  }

  profile(){
    this.router.navigate(['home/tabs/user-profile']);
  }

  viewRestaurant(item){
    this.infoBooking(item);
  }

  async infoBooking(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Info!',
      subHeader: 'the date of your booking: '+item.time_trame,
      message: 'Try to arrive on time!',
      buttons: [
        {
          text: 'Okay!',
          handler: (data: any) => {
          }
        },
        {
          text: 'Share',
          handler: (data: any) => {
            this.ShareFacebook(item);
          }
        },
      ]
    });

    await alert.present();
  }


  async getBooking(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
      mode: 'ios',
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

}
