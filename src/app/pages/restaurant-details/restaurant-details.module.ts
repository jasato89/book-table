import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantDetailsPageRoutingModule } from './restaurant-details-routing.module';

import { RestaurantDetailsPage } from './restaurant-details.page';

import { AgmCoreModule } from '@agm/core';

import { AnimatedLikeComponent } from '../../components/animated-like/animated-like.component';

import { SharedAnimationModule } from 'src/app/shared-animation/shared-animation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantDetailsPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDc7HjT92K2wZr6aeLqbuCOSaPUz3Mky-8',
      libraries: ['geometry']
    }),
    SharedAnimationModule
  ],
  declarations: [RestaurantDetailsPage]
})
export class RestaurantDetailsPageModule {}
