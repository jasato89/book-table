import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ModalController, LoadingController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-restaurants-topics',
  templateUrl: './restaurants-topics.page.html',
  styleUrls: ['./restaurants-topics.page.scss'],
})
export class RestaurantsTopicsPage implements OnInit {

  public topic: any;
  public topicAux: any;
  public searchTerm: any


  public postTopic = {
    topic: ''
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingController: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.topic = this.router.getCurrentNavigation().extras.state.item;
        console.log(this.topic);
        this.getListTopic(this.topic);
      }
    });
  }

  ngOnInit() {
  }

  async getListTopic(topic){
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    this.postTopic.topic = topic;
    this.authService.listingTopics(this.postTopic).subscribe(
      (res: any) => {
        loading.dismiss();
        this.topic = res;
        this.topic.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        this.topicAux = this.topic;
        console.log(this.topic);
      },
      (error: any) => {
        loading.dismiss();
        this.toastService.presentToast('Problema en la red.');
      }
    );
  }

  public back(){
    this.topic = null;
    this.location.back();
  }

  setFilteredItems() {
    this.topicAux = this.filterItems(this.searchTerm);
    console.log(this.topicAux);
  }

  viewRestaurant(item){
    console.log(item);
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.router.navigate(['home/tabs/tabs2/restaurant-details'], navigationExtras);
  }

  filterItems(searchTerm){
    return this.topic.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
