import { AbstractType, Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';

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
    private socialSharing: SocialSharing,
    private platform: Platform,
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
    var text = "J'ai une réservation au restaurant "+item.name+" restaurant le "+item.time_trame+" thanks to BookTable!";
    var logo = "https://booktable.app/wp-content/uploads/2020/12/LOGO-02.svg";
    var website = "https://booktable.app/";
    
    let shareRet = await Share.share({
      title: "BookTable - Booking",
      text: text,
      url: website,
      dialogTitle: 'Partager'
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
      header: 'Info',
      subHeader: 'La date de votre réservation est le '+item.time_trame,
      message: "Soyez à l'heure et bon appétit !",
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
          }
        },
        {
          text: 'Partager',
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
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.authService.getBookingActive(this.postData).subscribe(
      (res: any) => {
        this.activeRests = res;
        this.activeRests.forEach(element => {
          element.images = JSON.parse(element.images);
          var date = this.convertDateForIos(element.time_trame);
          element.time_trame = date;
        });
        if(this.activeRests.length == 0){
          this.haveData = false;
        }else{
          this.haveData = true;
        }
        console.log(this.activeRests);
        this.getLastsBookings();

        this.segment = 'active';
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
        loading.dismiss();
      }
    );
  }

  convertDateForIos(date) {
    var arr = date.split(/[. :]/);
    console.log(arr);
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);

    var dateStr =
          ("00" + date.getDate()).slice(-2) + "/" +
          ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          date.getFullYear() + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2);

    return dateStr;
  }


  async getLastsBookings(){

    this.authService.getsBookingsByUser(this.postData).subscribe(
      (res: any) => {
        this.lastBookings = res;
        this.lastBookings.forEach(element => {
          element.images = JSON.parse(element.images);
          //var datestring = moment(element.time_trame).format('DD-MM-YYYY HH:mm');
          var date = this.convertDateForIos(element.time_trame);
          element.time_trame = date;
        });
        
        if(this.lastBookings.length == 0){
          this.haveLastsRecords = false;
        }else{
          this.haveLastsRecords = true;
        }
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    )
  }

  

}
