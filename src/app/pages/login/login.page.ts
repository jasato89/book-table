import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

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

  postDataFacebook = {
    name: '',
    last_name: '',
    email: ''
  }

  postDataApple = {
    name: '',
    last_name: '',
    email: ''
  }

  private isIOS: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private safariViewController: SafariViewController,
    private fb: Facebook,
    private signInWithApple: SignInWithApple,
    private platform: Platform,
  ) {}

  public showPassword: boolean = false;

  ngOnInit() {
    if(this.platform.is('ios')){
      this.isIOS = true;
      console.log("ios true");
    }
  }

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

  async guestLogin(){
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios'
    });

    this.router.navigate(['/list-restaurants'], { replaceUrl: true });
  }

 loginWithApple(){
  this.signInWithApple.signin({
    requestedScopes: [
      ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
      ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
    ]
  })
  .then( async (res: AppleSignInResponse) => {
    // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
    //console.log('Send token to apple for verification: ' + res.identityToken);
    //console.log(res);

    this.postDataApple.email = res.email;
    this.postDataApple.name = res.fullName.givenName;
    this.postDataApple.last_name = res.fullName.familyName;

    let jsonToken = this.parseJwt(res.identityToken);
    this.postDataApple.email = jsonToken.email
    
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      mode: 'ios'
    });
    await loading.present();
    this.authService.loginApple(this.postDataApple).subscribe(
      (res: any) =>{
        if (res) {
          window.localStorage.setItem('access_token', res.access_token);
          window.localStorage.setItem('id_user', res.id_user);
          window.localStorage.setItem('name', res.name_user);
          window.localStorage.setItem('last_name', res.last_name);
          window.localStorage.setItem('email', res.email);
          window.localStorage.setItem('login', "1");
          window.localStorage.setItem('role', res.role);
          this.router.navigateByUrl('/home/tabs/tab1', { replaceUrl: true });
        }
        loading.dismiss();
      }
    )
  })
  .catch((error: AppleSignInErrorResponse) => {
    console.log(error.code + ' ' + error.localizedDescription);
    console.error(error);
  });
 }

 private parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

 loginWithFacebook(){
    this.fb.login(['public_profile', 'email'])
    .then(
      (res: FacebookLoginResponse) => {
        if(res.status == "connected"){
          let token = res.authResponse.accessToken;
          this.fb.api("me/?fields=id,email,first_name,last_name&access_token=" + token, [])
          .then(
            async (profile) => {
              //console.log(profile);
              this.postDataFacebook.email = profile.email;
              this.postDataFacebook.name = profile.first_name;
              this.postDataFacebook.last_name = profile.last_name;
              const loading = await this.loadingController.create({
                message: 'Chargement...',
                mode: 'ios'
              });
              await loading.present();
              this.authService.loginFacebook(this.postDataFacebook).subscribe(
                (res: any) =>{
                  if (res) {
                    window.localStorage.setItem('access_token', res.access_token);
                    window.localStorage.setItem('id_user', res.id_user);
                    window.localStorage.setItem('name', res.name_user);
                    window.localStorage.setItem('last_name', res.last_name);
                    window.localStorage.setItem('email', res.email);
                    window.localStorage.setItem('login', "1");
                    window.localStorage.setItem('role', res.role);
                    this.router.navigateByUrl('/home/tabs/tab1', { replaceUrl: true });
                  }
                  loading.dismiss();
                }
              )
            }
          ).catch(e => console.log('Error logging into Facebook', e));
        }else{
          console.log("not connected")
        }
      })
    .catch(e => console.log('Error logging into Facebook', e));
  }

  registerAction(){
    this.router.navigateByUrl('/register');
  }
  resetpasswordAction(){
    this.router.navigateByUrl('/resetpassword');
  }

  businessAction(){
    this.router.navigateByUrl('/register-business');
  }

  public optionsFn(): void { //here item is an object 
    console.log(this.postData);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Attention',
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
          this.router.navigateByUrl('/home/tabs/tab1', { replaceUrl: true });
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