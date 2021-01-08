import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantsTopicsPage } from './restaurants-topics.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantsTopicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantsTopicsPageRoutingModule {}
