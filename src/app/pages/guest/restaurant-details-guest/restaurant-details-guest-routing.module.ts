import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantDetailsGuestPage } from './restaurant-details-guest.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantDetailsGuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantDetailsGuestPageRoutingModule {}
