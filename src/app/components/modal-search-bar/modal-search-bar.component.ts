import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavController,ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSearchbar} from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-modal-search-bar',
  templateUrl: './modal-search-bar.component.html',
  styleUrls: ['./modal-search-bar.component.scss'],
})


export class ModalSearchBarComponent implements OnInit, AfterViewInit {

  @ViewChild('search', { static: false }) searchbar: IonSearchbar;

  public restaurants: any;
  public restaurantsAux: any;
  public searchTerm: any;
  public id_user: any;
  public postData = {
    id_user: ''
  };
  constructor(
    private nav:NavController,
    private modalCtrl:ModalController,
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute, 
    private router: Router
    ) { }

  ngOnInit() {
    this.getRestaurants();
  }

  ngAfterViewInit(){

  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  viewRestaurant(item){
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
    this.modalCtrl.dismiss();
}

  getRestaurants(){
    this.id_user = window.localStorage.getItem('id_user');
    this.postData.id_user = this.id_user;
    this.authService.getAllRestaurants(this.postData).subscribe(
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
    console.log(this.restaurantsAux);
  }


  filterItems(searchTerm){
    return this.restaurants.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
