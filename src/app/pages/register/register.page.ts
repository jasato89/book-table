import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { Sim } from '@ionic-native/sim/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public postData = {
    name: '',
    last_name: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
    consent: false
  }

  constructor(
    private location: Location,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private sim: Sim,
    private platform: Platform
  ) {
    
    if(!this.platform.is('mobileweb')){
      this.sim.getSimInfo().then(
        (info) => console.log('Sim info: ', info),
        (err) => console.log('Unable to get sim info: ', err)
      );
    }
  }

  ngOnInit() {
  }

  validatePassword(){
    this.postData.password = this.postData.password.trim();
    this.postData.password_confirmation = this.postData.password_confirmation.trim();
    if(this.postData.password && this.postData.password_confirmation){
      if(this.postData.password == this.postData.password_confirmation){
        return true;
      }else{
        this.toastService.presentToast('Passwords dont match');
      }
    }else{
      this.toastService.presentToast('Remplissez les champs');
    }
  }

  validateInputs(){
    if(this.postData.name && this.postData.last_name && this.postData.telephone){
      return true;
    }else{
      this.toastService.presentToast('Remplissez les champs!');
    }
  }

  validateEmail(){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(this.postData.email)) {
      return true;
    }else{
      this.toastService.presentToast('Invalid email');
    }
  }

  async createSignUp(){
    if(this.validateInputs()){
      if(this.validateEmail()){
        if(this.validatePassword()){
          const loading = await this.loadingController.create({
            message: 'Chargement...',
            mode: 'ios'
          });
          await loading.present();
          this.authService.register(this.postData).subscribe(
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
          )
        }
      }
    }
  }

 async presentAlert(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Thank you to join us!',
      subHeader: 'Log in and enjoy the journey',
      buttons: [
        {
          text: 'Okey!',
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

}
