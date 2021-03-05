import { AbstractType, Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ModalSearchBarComponent } from '../../components/modal-search-bar/modal-search-bar.component';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  public name: any;
  public last_name: any;
  public email: any;

  public postData = {
    id: '',
    name: '',
    last_name: '',
    email: '',
  };

  constructor(
    public modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.postData.id = window.localStorage.getItem('id_user');
    this.name = window.localStorage.getItem('name');
    this.last_name = window.localStorage.getItem('last_name');
    this.email = window.localStorage.getItem('email');
  }

  async updateProfile(){
    if(this.validateInputs()){
      const loading = await this.loadingController.create({
        message: 'Chargement...',
        mode: 'ios',
      });
      await loading.present();
      this.authService.update(this.postData).subscribe(
        (res: any) => {
          this.name = res.name;
          this.last_name = res.last_name;
          this.email = res.email;

          window.localStorage.setItem('name', res.name);
          window.localStorage.setItem('last_name', res.last_name);
          window.localStorage.setItem('email', res.email);
          loading.dismiss();
        },
        (error: any) => {
          if(error.error.errors.email[0]){
            this.toastService.presentToast("Cette adresse emaill est dèjá utilisée");
          }
          loading.dismiss();
        }
      )
    }else{
      this.toastService.presentToast('Remplissez les champs');
    }
  }

  validateInputs(){
    if (this.postData.name && this.postData.last_name && this.postData.email){
      return true;
    }
  }
  
  logout(){
    this.authService.logout();
  }


}
