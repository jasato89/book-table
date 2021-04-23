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
    commensals: "",
    divisible: true,
    turn: ''
  }

  public myRest: any;

  public arrayCouverts: any[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

  public arrayTurns: any[] = new Array();  

  public turnNight = {
    turn_text: 'Soir',
    turn: 2
  }

  public turnMidday = {
    turn_text: 'Midi',
    turn: 1
  }

  constructor(
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
  ) {
    this.postId.id_user = window.localStorage.getItem('id_user');
    this.getMyRestaurants();
  }

  ionViewWillEnter() {
    this.postId.id_user = window.localStorage.getItem('id_user');
    this.getMyRestaurants();
    this.setTurns();
  }

  ngOnInit() {
  }

  back(){
    this.location.back();
    this.myRest = null;
  }

  setTurns(){
    var now = new Date();
    var nowTime = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
    var limit = "17:00";

    if(nowTime >= limit){
      this.arrayTurns.push(this.turnNight)
    }else{
      this.arrayTurns.push(this.turnMidday);
      this.arrayTurns.push(this.turnNight)
    }

  }

  async createBooking(){
    if(this.validateInputs()){
      const loading = await this.loadingController.create({
        message: 'Chargement...',
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
      this.toastService.presentToast('Remplissez les champs');
    }

  }

  validateInputs(){
    console.log(this.postData);
    if (this.postData.id_rest && this.postData.turn && this.postData.commensals){
      return true;
    }
  }


  async getMyRestaurants(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.authService.getMyRestaurants(this.postId).subscribe(
      (res: any) => {
        this.myRest = res;
        this.postData.id_rest = this.myRest.id;
        console.log(this.myRest);
        loading.dismiss();
      },
      (error: any) => {
        this.toastService.presentToast('Problème de réseau');
        loading.dismiss();
      }
    )
  }

}
