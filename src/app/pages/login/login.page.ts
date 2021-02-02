import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { LoadingController, AlertController  } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})

export class LoginPage implements OnInit {
  
  postData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  public showPassword: boolean = false;

  ngOnInit() {}

  validateInputs() {
    let email = this.postData.email.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.email &&
      this.postData.password &&
      email.length > 0 &&
      password.length > 0
    );
  }

  registerAction(){
    this.router.navigateByUrl('/register');
  }

  businessAction(){
    
  }

  public optionsFn(): void { //here item is an object 
    console.log(this.postData);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Incorrect user or password',
      buttons: ['OK']
    });

    await alert.present();
  }

  async loginAction() {
    if (this.validateInputs()) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
        mode: 'ios'
      });
      await loading.present();
      this.authService.login(this.postData).subscribe(
        (res: any) => {
          if (res) {
          // Storing the User data.
          loading.dismiss();
          console.log(res);
          window.localStorage.setItem('access_token', res.access_token);
          window.localStorage.setItem('id_user', res.id_user);
          window.localStorage.setItem('name', res.name_user);
          window.localStorage.setItem('last_name', res.last_name);
          window.localStorage.setItem('email', res.email);
          window.localStorage.setItem('login', "1");
          window.localStorage.setItem('role', res.role);
          this.router.navigateByUrl('/home/tabs/tab1');
          } else {
            loading.dismiss();
            this.presentAlert();
          }
        },
        (error: any) => {
          loading.dismiss();
          console.log(error);
          this.presentAlert();
        }
      );
    } else {
      this.toastService.presentToast('Please fill the fields');
    }
  }

  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

}