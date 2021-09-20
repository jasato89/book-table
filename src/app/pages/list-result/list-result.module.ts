import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListResultPageRoutingModule } from './list-result-routing.module';

import { ListResultPage } from './list-result.page';

import { AnimatedLikeComponent } from '../../components/animated-like/animated-like.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListResultPageRoutingModule
  ],
  declarations: [ListResultPage, AnimatedLikeComponent]
})
export class ListResultPageModule {}
