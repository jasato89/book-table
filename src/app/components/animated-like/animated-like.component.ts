import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-animated-like',
  templateUrl: './animated-like.component.html',
  styleUrls: ['./animated-like.component.scss'],
  animations: [
    trigger('heart', [
        state('unliked', style({
            color: '#fff',
            opacity: '0.8',
            transform: 'scale(1)'
        })),
        state('liked', style({
            color: '#e74c3c',
            opacity: '1',
            transform: 'scale(1.1)'
        })),
        transition('unliked <=> liked', animate('100ms ease-out'))
    ])
  ]
})
export class AnimatedLikeComponent implements OnInit, OnDestroy {

  public likeState: string;
  public iconName: string;

  public postData = {
    id_user: '',
    id_rest: ''
  };

  @Input() id_user: any;
  @Input() id_rest: any;
  @Input() like: any;

  constructor(
    private authService: AuthService, 
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.getState();
  }

  ionViewDidLeave() {
  }

  ngOnDestroy(){
    this.postData = null;
    this.likeState = null;
    this.iconName = null;
  }

  getState(){
    if(this.like){
      this.likeState = 'liked';
      this.iconName = "assets/icon/heart_green.svg";
    }else{
      this.likeState = 'unliked';
      this.iconName = "assets/icon/heart_empty.svg";
    }
  }

  async getStatePetition(){
    this.postData = {
      id_rest: this.id_rest,
      id_user: window.localStorage.getItem('id_user'),
    }

    this.authService.getOneLike(this.postData).subscribe(
      (res: any) => {
        if(res){
          this.likeState = 'liked';
          this.iconName = "assets/icon/heart_green.svg";
        }else{
          this.likeState = 'unliked';
          this.iconName = "assets/icon/heart_empty.svg";
        }
      },
      (error: any) => {
        this.toastService.presentToast('Probl??me de r??seau.');
      }
    );
  }

  setLike(){
    this.postData = {
      id_rest: this.id_rest,
      id_user: window.localStorage.getItem('id_user'),
    }
    this.authService.setLikeRestaurant(this.postData).subscribe(
      (res: any) => {
        if (res){
          this.toastService.presentToast('Ajout?? aux favoris');
        }else{
          this.toastService.presentToast('Retir?? de vos envies. ??????');
        }
      },
      (error: any) => {
        this.toastService.presentToast('Probl??me de r??seau.');
      }
    );
  }

  toggleLikeState(){
    this.setLike();
    if(this.likeState == 'unliked'){
      this.likeState = 'liked';
      this.iconName = "assets/icon/heart_green.svg";

    } else {
      this.likeState = 'unliked';
      this.iconName = "assets/icon/heart_empty.svg";
    }

  }

}