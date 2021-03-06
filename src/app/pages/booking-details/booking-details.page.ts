import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, LoadingController, AlertController, ActionSheetController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {

  public postData = {
    id_booking: ''
  }

  public booking: any;

  public hasArrived: boolean;
  public hasPending: boolean;

  constructor(
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    ) { 
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.booking = this.router.getCurrentNavigation().extras.state.item;
          if(this.booking.user_name){
            console.log(this.booking);
            this.hasArrived = true;
            this.hasPending = false;
          }else{
            this.hasArrived = false;
            this.hasPending = true;
          }
        }
      });
    }

  ngOnInit() {
  }


  back(){
    this.booking = null;
    this.router.navigate(['home/tabs/booking-system/']);
  }

  async _hasArrived(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.postData.id_booking = this.booking.id;
    this.authService.hasArrived(this.postData).subscribe(
      (res: any) => {
        loading.dismiss();
        console.log(res);
        this.showAlertFinish();
      },
      (error: any) => {
        loading.dismiss();
      }
    )
  }

  async deleteBooking(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios',
    });
    await loading.present();
    this.postData.id_booking = this.booking.id;
    this.authService.deleteBooking(this.postData).subscribe(
      (res: any) => {
        loading.dismiss();
        console.log(res);
        this.showAlertDelete();
      },
      (error: any) => {
        loading.dismiss();
      }
    )
  }

  showAlertFinish(){
    this.alertController.create({
      mode: 'ios',
      header: 'BookTable',
      subHeader: 'Booking termin??e',
      message: 'Vous avez indiqu?? vette r??servation comme termin??e.',
      buttons: [
        {
          text: 'Done!',
          handler: (data: any) => {
            this.location.back();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  showAlertDelete(){
    this.alertController.create({
      mode: 'ios',
      header: 'BookTable',
      subHeader: 'R??servation annul??e',
      message: 'Votre table disponible a ??t?? annul??e.',
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
            this.location.back();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
