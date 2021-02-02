import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.page.html',
  styleUrls: ['./booking-create.page.scss'],
})
export class BookingCreatePage implements OnInit {

  public postId = {
    id_user: ""
  }

  public postData = {
    id_rest: "",
    time: "",
    commensals: "",
    divisible: false,
  }

  public myRest: any;

  constructor(
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
  ) {
    
  }

  ionViewWillEnter() {
    this.postId.id_user = window.localStorage.getItem('id_user');
    this.getMyRestaurants();
  }

  ngOnInit() {
  }

  back(){
    this.location.back();
  }

  async createBooking(){
    if(this.validateInputs()){
      console.log(this.postData);
      const loading = await this.loadingController.create({
        message: 'Loading...',
        mode: 'ios',
      });
      await loading.present();
      this.authService.createBooking(this.postData).subscribe(
        (res: any) => {
          loading.dismiss();
          this.location.back();
        },
        (error: any) => {
          loading.dismiss();
        }
      );
    }else{
      this.toastService.presentToast('fill the fields!');
    }

  }

  validateInputs(){
    if (this.postData.id_rest && this.postData.time && this.postData.commensals){
      return true;
    }
  }


  async getMyRestaurants(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
      mode: 'ios',
    });
    await loading.present();
    this.authService.getMyRestaurants(this.postId).subscribe(
      (res: any) => {
        this.myRest = res;
        console.log(this.myRest);
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problema en la red.');
        loading.dismiss();
      }
    )
  }

}
