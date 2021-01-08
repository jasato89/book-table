import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
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

  public height: any;
  public id_user: any;
  public id_rest: any;

  public avaibleMap: boolean;


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
    private loadingController: LoadingController
  ) { 

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id_user = window.localStorage.getItem('id_user');
        this.restaurant = this.router.getCurrentNavigation().extras.state.item;
        console.log(this.restaurant.restaurant_menu);
        if(this.restaurant.restaurant_menu.length == 0){
          this.restaurant.restaurant_menu = JSON.parse(this.restaurant.restaurant_menu);
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
    var url = "https://panel.booktable.app/storage/"+this.restaurant.restaurant_menu;
    this.socialSharing.shareViaWhatsApp(this.restaurant.name, img, url);
  }

  back(){
    this.avaibleMap = false;
    this.restaurant = null;
    this.lng = null;
    this.lat = null;
    this.location.back();
  }

  async haveBooking(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
      mode: 'ios',
    });
    await loading.present();
    this.postData.id_rest = this.restaurant.id;
    this.authService.haveBooking(this.postData).subscribe(
      (res: any) => {
        this._haveBooking = res;
        if(this._haveBooking.length == 0){
          this._haveBooking = null;
        }
        this.lat = parseFloat(this.restaurant.coords[0].lat);
        this.lng = parseFloat(this.restaurant.coords[0].lng);
        this.height = 300;
        this.avaibleMap = true;
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
        loading.dismiss();
      }
    );
  }

}
