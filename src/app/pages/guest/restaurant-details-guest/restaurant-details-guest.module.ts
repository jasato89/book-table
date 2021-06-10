import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantDetailsGuestPageRoutingModule } from './restaurant-details-guest-routing.module';

import { RestaurantDetailsGuestPage } from './restaurant-details-guest.page';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantDetailsGuestPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDc7HjT92K2wZr6aeLqbuCOSaPUz3Mky-8',
      libraries: ['geometry']
    }),
  ],
  declarations: [RestaurantDetailsGuestPage]
})
export class RestaurantDetailsGuestPageModule {}
