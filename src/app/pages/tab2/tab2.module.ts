import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ModalSearchBarModule } from '../../components/modal-search-bar/modal-search-bar.module'
import { Tab2PageRoutingModule } from './tab2-routing.module';

import { AgmCoreModule } from '@agm/core';

import { AnimatedLikeComponent } from '../../components/animated-like/animated-like.component';

import { SharedAnimationModule } from 'src/app/shared-animation/shared-animation.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ModalSearchBarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDc7HjT92K2wZr6aeLqbuCOSaPUz3Mky-8',
      libraries: ['geometry']
    }),
    SharedAnimationModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
