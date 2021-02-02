import { Component,  } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { NavController } from '@ionic/angular';
import { Platform, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications } = Plugins;

import { Capacitor } from '@capacitor/core';

const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  

  public role: any;
  public postData = {
    id_user: '',
    device_token: ''
  }

  public isUser: boolean;
  public isBusiness: boolean;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.setRole();

    if (isPushNotificationsAvailable) {
      this.initPushNotifications();
   }
  }
  
  initPushNotifications(){
    console.log('Initializing Notifications System');
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log('Push registration success, token: ' + token.value);
        console.log(token);
        if(token.value){
          this.registerDeviceToken(token.value);
        }
      },
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
        this.createNotification(notification);
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      },
    );
  }

  setRole(){
    this.role = window.localStorage.getItem('role');
    this.isUser = false;
    this.isBusiness = false;

    switch(this.role){
      case "2":
        this.isUser = true;
        break;
      case "3":
        this.isBusiness = true;
        this.router.navigate(['home/tabs/booking-system']);
        break;
      default:
        this.isUser = true;
        break;
    }
  }

  registerDeviceToken(token){
    this.postData.id_user = window.localStorage.getItem('id_user');
    this.postData.device_token = token;
    this.authService.registerTokenDevice(this.postData).subscribe(
      (res: any) => {
        console.log(res);
      },
      (error: any) => {

      } 
    )
  }

  createNotification(notification){

    this.alertController.create({
      mode: 'ios',
      header: 'BookTable',
      subHeader: notification.title,
      message:  notification.body,
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}

