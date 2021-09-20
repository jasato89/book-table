import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantBookingPageRoutingModule } from './restaurant-booking-routing.module';

import { RestaurantBookingPage } from './restaurant-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantBookingPageRoutingModule
  ],
  declarations: [RestaurantBookingPage]
})
export class RestaurantBookingPageModule {}
