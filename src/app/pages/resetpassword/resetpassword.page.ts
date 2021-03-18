import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {

  public postData = {
    email: '',
  }

  constructor(
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  async resetPassword(){
    if(this.validateEmail()){
      const loading = await this.loadingController.create({
        message: 'Chargement...',
        mode: 'ios'
      });
      await loading.present();
      console.log(this.postData);
      this.authService.resetPassword(this.postData).subscribe(
        (res: any) => {
          loading.dismiss();
          this.presentAlert();
        },
        (error: any) => {
          console.log(error.errors);
          loading.dismiss();
          if(error.error.errors.email[0]){
            this.toastService.presentToast(error.error.errors.email[0]);
          }
          if(error.error.errors.consent[0]){
            this.toastService.presentToast(error.error.errors.consent[0]);
          }

        }
      );
    }
  }

  async presentAlert(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'BookTable',
      subHeader: 'Nous avons envoyé un email de vérification à votre adresse électronique.',
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
            this.location.back();
          }
        },
      ]
    });
    await alert.present();
  }

  back(){
    this.location.back();
  }

  validateEmail(){
    this.postData.email = this.postData.email.trim();
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(this.postData.email)) {
      return true;
    }else{
      this.toastService.presentToast('Invalid email');
    }
  }

}
