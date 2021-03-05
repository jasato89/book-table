import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantBookingPage } from './restaurant-booking.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantBookingPageRoutingModule {}
