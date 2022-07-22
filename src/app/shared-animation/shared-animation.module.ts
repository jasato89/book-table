
import { NgModule } from '@angular/core';
import { AnimatedLikeComponent } from '../components/animated-like/animated-like.component';
import { IonicModule } from '@ionic/angular';
@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [
    AnimatedLikeComponent,
  ],
  exports: [
    AnimatedLikeComponent,
  ]
})
export class SharedAnimationModule { }