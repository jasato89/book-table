import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantDetailsGuestPageRoutingModule } from './restaurant-details-guest-routing.module';

import { RestaurantDetailsGuestPage } from './restaurant-details-guest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantDetailsGuestPageRoutingModule
  ],
  declarations: [RestaurantDetailsGuestPage]
})
export class RestaurantDetailsGuestPageModule {}
