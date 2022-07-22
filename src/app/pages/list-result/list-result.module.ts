import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListResultPageRoutingModule } from './list-result-routing.module';

import { ListResultPage } from './list-result.page';

import { AnimatedLikeComponent } from '../../components/animated-like/animated-like.component';

import { SharedAnimationModule } from 'src/app/shared-animation/shared-animation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListResultPageRoutingModule,
    SharedAnimationModule
  ],
  declarations: [ListResultPage]
})
export class ListResultPageModule {}
