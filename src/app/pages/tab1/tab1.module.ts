import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';


import { Tab1PageRoutingModule } from './tab1-routing.module';

import { AnimatedLikeComponent } from '../../components/animated-like/animated-like.component';

import { SharedAnimationModule } from 'src/app/shared-animation/shared-animation.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    SharedAnimationModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
