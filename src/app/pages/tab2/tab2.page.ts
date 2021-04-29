import { Component, ViewChild } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { ModalController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { LocationService } from './../../services/location.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader } from '@agm/core';
import { AgmMap } from '@agm/core';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild('agmMap') agmMap : AgmMap;

  public coordLatitude: any;
  public coordLongitude: any;
  public height: 300;
  public avaibleMap: boolean;

  public radius = 500;
  public radiusLat = 0;
  public radiusLong = 0;
  public radiusGPS: any;

  public restaurants: any;
  public restaurantsFilter: any;
  public cities: any;
  public commensals: any;
  public topics: any;
  public city: any;
  public segment: any;

  public postData = {
    topic: '',
    commensals: '',
    city: '',
    favorites: false,
    bib_gourmand: false,
    michelin: false,
    id_user: ''
  };

  public id_user: any;

  constructor(
    public modalController: ModalController,
    private geolocation: Geolocation,
    private mapsAPILoader: MapsAPILoader,
    private loadingController: LoadingController,
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute, 
    private router: Router,
    private locationService: LocationService,
    private navCtrl: NavController,
    private platform: Platform
  ) {}

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.getRestaurants();
    this.getCities();
  }

  ionViewDidEnter(){
    this.mapsAPILoader.load().then(() => {
      this.getMyLocation();
    });
  }

  ionViewDidLeave(){
    this.coordLatitude = null;
    this.coordLongitude = null;
    this.avaibleMap = false;
  }

  openModal(){
    this.presentModal();
  }

  segmentChanged(ev: any) {

  }

  drawMap() {
    this.agmMap.triggerResize();
  }

  async getMyLocation() {
    if (this.platform.is('ios')){
      this.setCurrentLocation();
    }else{
      this.requestPermissionAndroid();
    }
  }

  async requestPermissionAndroid(){
    const hasPermission = await this.locationService.checkGPSPermission();
    if (hasPermission) {
      if (Capacitor.isNative) {
        const canUseGPS = await this.locationService.askToTurnOnGPS();
        this.postGPSPermission(canUseGPS);
      }
      else { this.postGPSPermission(true); }
    }
    else {
      const permission = await this.locationService.requestGPSPermission();
      if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
        if (Capacitor.isNative) {
          const canUseGPS = await this.locationService.askToTurnOnGPS();
          this.postGPSPermission(canUseGPS);
        }
        else { this.postGPSPermission(true); }
      }
    }
  }

  async postGPSPermission(canUseGPS: boolean) {
    if (canUseGPS) { this.watchPosition(); }
    else {
      this.toastService.presentToast('Please turn on GPS to get location');
    }
  }

  async watchPosition() {
    try {
      this.setCurrentLocation();
    }
    catch (err) {}
  }


  async setCurrentLocation(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coordLatitude = resp.coords.latitude;
      this.coordLongitude = resp.coords.longitude;
      this.radiusLat = this.coordLatitude;
      this.radiusLong = this.coordLongitude;
      this.avaibleMap = true;
      if (this.restaurants){
        this.showHideMarkers();
      }
      this.segment = 'proximity';
      loading.dismiss();
   }).catch((error) => {
      loading.dismiss();
   });
  }

  clickedMarker(label: string, index: number) {

  }

  async getRestaurants(){
    this.id_user = window.localStorage.getItem('id_user');
    this.authService.getAllRestaurants().subscribe(
      (res: any) => {
        var maxLength = 100;
        this.restaurants = res;
        this.restaurants.forEach(element => {
          element.images = JSON.parse(element.images);
          element.isShown = false;
          element.description_short = element.description.substring(0, maxLength) + '...';
          element.restaurant_menu = JSON.parse(element.restaurant_menu);
          if(element.restaurant_menu[0]){
            element.restaurant_menu = element.restaurant_menu[0].download_link;
          }
        });
        this.showHideMarkers();
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  optionsFn(radiusGPS){
    this.radius = parseInt(radiusGPS);
    this.showHideMarkers();
  }

  showHideMarkers(){
    this.restaurants.forEach(value => {
      value.isShown = this.getDistanceBetween(value.coords[0].lat, value.coords[0].lng, this.radiusLat, this.radiusLong);
    });
  }

  optionsCommensals(commensals){
    this.commensals = commensals;
  }

  optionsTopics(topics){
    this.topics = topics;
  }

  optionsCity(city){
    this.city = city;
  }

  tabChange(segment){
    if(segment == 'proximity'){
      
    }else{
      this.coordLatitude = null;
      this.coordLongitude = null;
      this.avaibleMap = false;
    }
  }
  
  refreshProximity(){
    this.getMyLocation();
  }

  validateInputs() {
    let commensals = this.commensals;
    return (
      this.commensals &&
      commensals.length > 0
    );
  }

  viewRestaurant(m){
      let navigationExtras: NavigationExtras = {
        state: {
          item: m
        }
      };
      this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

  profile(){
    this.router.navigate(['home/tabs/user-profile']);
  }

  getDistanceBetween(lat1, long1, lat2, long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){    
      return true;
    }else{
      return false;
    }
  }

  getCities(){
    this.authService.getCitysFromRestaurants().subscribe(
      (res: any) => {
        this.cities = res;
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  async searchAction(){

    if(this.validateInputs()){
   
      const loading = await this.loadingController.create({
        message: 'Chargement...',
        mode: 'ios',
      });
      await loading.present();
      this.postData.commensals = this.commensals;
      this.postData.topic = this.topics;
      this.postData.city = this.city;
      this.postData.id_user = window.localStorage.getItem('id_user');

      console.log(this.postData);

      this.authService.getBookings(this.postData).subscribe(
        (res: any) => {
          var maxLength = 140;
          this.restaurantsFilter = res;
          if(this.restaurantsFilter){
            this.restaurantsFilter.forEach(element => {
              element.images = JSON.parse(element.images);
              element.description_short = element.description.substring(0, maxLength) + '...';
            });
          }else{
            this.toastService.presentToast("Il n'y a aucum restaurant correspondant à vos critères ");
          }
       
          loading.dismiss();
        },
        (error: any) => {
          loading.dismiss();
          this.restaurantsFilter = null;
        }
      );

    }else{
      this.toastService.presentToast('Remplissez les champs.');
    }
    
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalSearchBarComponent,
      cssClass: 'my-modal-component'
    });
    return await modal.present();
  }

}
