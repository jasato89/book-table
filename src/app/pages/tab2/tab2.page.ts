import { Component, ViewChild } from '@angular/core';
import { Capacitor, Plugins } from "@capacitor/core";
import { ModalController, LoadingController, NavController } from '@ionic/angular';
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

  // Radius
  public radius = 500;
  public radiusLat = 0;
  public radiusLong = 0;
  public radiusGPS: any;

  public restaurants: any;
  public restaurantsFilter: any;
  public commensals: any;
  public topics: any;
  public segment: any;

  public postData = {
    topic: '',
    commensals: ''
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
  ) {}

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.getRestaurants();
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
    //console.log('Segment changed', ev);
  }

  drawMap() {
    this.agmMap.triggerResize();
  }

  async getMyLocation() {
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
      else {
        console.log('Error getting location');
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
    catch (err) { console.log('err', err) }
  }


  async setCurrentLocation(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
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
      console.log('Error getting location', error);
   });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
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
          element.restaurant_menu = element.restaurant_menu[0].download_link;
        });
        console.log(this.restaurants);
        this.showHideMarkers();
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
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
    this.searchAction();
  }

  optionsTopics(topics){
    this.topics = topics;
    this.searchAction();
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
    let topics = this.topics;
    let commensals = this.commensals;
    return (
      this.topics &&
      this.commensals &&
      topics.length > 0 &&
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

  getDistanceBetween(lat1, long1, lat2, long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){    
      console.log('Radius',this.radius);
      
      console.log('Distance Between',google.maps.geometry.spherical.computeDistanceBetween(
        from,to
      ));
      return true;
    }else{
      return false;
    }
  }

  async searchAction(){
   
    const loading = await this.loadingController.create({
      message: 'Loading...',
      mode: 'ios',
    });
    await loading.present();
    this.postData.commensals = this.commensals;
    this.postData.topic = this.topics;

    this.authService.getBookings(this.postData).subscribe(
      (res: any) => {
        var maxLength = 140;
        loading.dismiss();
        this.restaurantsFilter = res;
        this.restaurantsFilter.forEach(element => {
          element.images = JSON.parse(element.images);
          element.description_short = element.description.substring(0, maxLength) + '...';
        });
      },
      (error: any) => {
        loading.dismiss();
        console.log(error);
      }
    );
    
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalSearchBarComponent,
      cssClass: 'my-modal-component'
    });
    return await modal.present();
  }

}
