import { Component } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public favorites: any;
  public wishlist: any;
  public restaurants: any;
  public restaurantsAux: any;
  public cities: any;

  public topics: any;
  public city: any;
  public RadiusGPS: any;

  public segment: any;
  public searchTerm: any;

  public postData = {
    id_user: ''
  };

  public postWish = {
    id_user: '',
    topic: '',
    city: '',
    range: '',
  };

  public postWishDelete = {
    id_user: '',
    id: '',
  };

  public id_user: any;

  constructor(
    public modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router
  ) {}

  doRefresh(event) {
    this.getFavoritesByUserForRefresh(event);
  }

  ionViewWillEnter() {
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.id_user = window.localStorage.getItem('id_user');
    this.getFavoritesByUser();
  }

  private async getFavoritesByUserForRefresh(event){
    this.authService.getLikes(this.postData).subscribe(
      (res: any) => {
        this.favorites = res;
        this.favorites.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        this.segment = window.localStorage.getItem('tab3-save')
        if(this.segment == null){
          this.segment = 'favorites';
        }

        this.getRestaurants();
        this.getWishesByUser();
        this.getCities();
        if(this.favorites.length == 0){
          this.favorites = null;
          this.emptyList();
        }
        event.target.complete();
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
        event.target.complete();
      }
    )
  }

  async getFavoritesByUser(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.authService.getLikes(this.postData).subscribe(
      (res: any) => {
        this.favorites = res;
        this.favorites.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        this.segment = window.localStorage.getItem('tab3-save')
        if(this.segment == null){
          this.segment = 'favorites';
        }

        this.getRestaurants();
        this.getWishesByUser();
        this.getCities();
        loading.dismiss();
        if(this.favorites.length == 0){
          this.favorites = null;
          this.emptyList();
        }
        
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    )
  }

  async emptyList() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oups!',
      subHeader: "On dirait que vous n'avez encore rien ajouté aux favoris",
      message: "Essayez d'abord d'ajouter un restaurant aux favoris",
      buttons: ['OK']
    });

    await alert.present();
  }

  getRestaurants(){
    this.authService.getAllRestaurants().subscribe(
      (res: any) => {
        this.restaurants = res;
        this.restaurants.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        this.restaurantsAux = this.restaurants;
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }


  setFilteredItems() {
    this.restaurantsAux = this.filterItems(this.searchTerm);
  }


  filterItems(searchTerm){
    return this.restaurants.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  viewRestaurant(item){
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

  profile(){
    this.router.navigate(['home/tabs/user-profile']);
  }

  getWishesByUser(){
    this.authService.getWishesByUser(this.postData).subscribe(
      (res: any) => {
        this.wishlist = res;
        if(this.wishlist.length == 0){
          this.wishlist = null;
        }else{
          this.wishlist.forEach(element => {
            element.have_range = this.setRange(element.have_range);
          });
        }
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
      }
    );
  }

  setRange(range){
    var result;
    switch(range){
      case "500":
        result = "500m";
        break;
      case "1000":
        result = "1km";
        break;
      case "5000":
        result = "5km";
        break;
      case "10000":
        result = "10km";
        break;
      case "20000":
        result = "20km";
        break;
    }

    return result;
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

  async addWish(){
    if(this.validateInputs()){
      const loading = await this.loadingController.create({
        message: 'Chargement...',
        mode: 'ios',
      });
      await loading.present();
      this.postWish.id_user = window.localStorage.getItem('id_user');
      this.postWish.topic = this.topics;
      this.postWish.city = this.city;
      this.postWish.range = this.RadiusGPS;
      this.authService.storetWishByUser(this.postWish).subscribe(
        (res: any) => {
          this.toastService.presentToast('Envie ajoutée');
          this.getFavoritesByUser();
          loading.dismiss();
        },
        (error: any) => {
          this.toastService.presentToast('Problème de réseau.');
          loading.dismiss();
        }
      );
    }else{
      this.toastService.presentToast('Remplissez les champs');
    }
  }

  validateInputs(){
    if (this.topics && this.city && this.RadiusGPS){
      return true;
    }
  }

  async deleteWish(fav){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.postWishDelete.id_user = window.localStorage.getItem('id_user');
    this.postWishDelete.id = fav.id;

    this.authService.deleteWishByUser(this.postWishDelete).subscribe(
      (res: any) => {
        this.getFavoritesByUser();
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau.');
        loading.dismiss();
      }
    );

  }

  tabChange(event){
    window.localStorage.setItem('tab3-save', event);
  }

  optionsTopics(topic){

  }

  optionsCity(city){

  }

  optionsFn(RadiusGPS){

  }

}
