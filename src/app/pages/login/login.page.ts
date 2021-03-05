import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { LoadingController, AlertController  } from '@ionic/angular';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';



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
    private alertController: AlertController,
    private safariViewController: SafariViewController
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
    this.safariViewController.isAvailable().then((available: boolean) => {
      if (available) {

        this.safariViewController.show({
          url: 'https://booktable.app/business/',
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
        // use fallback browser, example InAppBrowser
      }
    }
  );
  }

  public optionsFn(): void { //here item is an object 
    console.log(this.postData);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Attetion',
      message: "Nom d'utilisateur ou mot de passe incorrect",
      buttons: ['OK']
    });

    await alert.present();
  }

  async loginAction() {
    if (this.validateInputs()) {
      const loading = await this.loadingController.create({
        message: 'Chargement...',
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
      this.toastService.presentToast('Remplissez les champs');
    }
  }

  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

}