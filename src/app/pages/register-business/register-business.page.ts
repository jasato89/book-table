import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { Sim } from '@ionic-native/sim/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register-business.page.html',
  styleUrls: ['./register-business.page.scss'],
})
export class RegisterBusinessPage implements OnInit {

  public postData = {
    name: '',
    last_name: '',
    email: '',
    telephone: '',
    address: '',
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
    private platform: Platform,
    private safariViewController: SafariViewController,
    private inAppBrowser: InAppBrowser
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

  private viewPolicy(){

    this.safariViewController.isAvailable().then((available: boolean) => {
      if (available) {
          this.safariViewController.show({
            url: 'https://booktable.app/politique-de-confidentialite/',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#00ba5c'
          })
          .subscribe((result: any) => {
              if(result.event === 'opened') console.log('Opened');
              else if(result.event === 'loaded') console.log('Loaded');
              else if(result.event === 'closed') console.log('Closed');
            },
            (error: any) => console.error(error)
          );

        } else {
          // Opening a URL and returning an InAppBrowserObject
          const browser = this.inAppBrowser.create('https://booktable.app/politique-de-confidentialite/', '_system', 'location=yes');
        }
      }
    );

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
          this.authService.registerBusiness(this.postData).subscribe(
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
