import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private firebaseAnalytics: FirebaseAnalytics,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.firebaseAnalytics.logEvent('page_view', {page: "Login"})
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));

      let login = window.localStorage.getItem('login');
      console.log("Login: "+login);
      if (login=="1"){
        this.router.navigateByUrl('/home/tabs/tab1');
      }else{
        this.router.navigate(["/login"]);
      }
    });
  }
}
