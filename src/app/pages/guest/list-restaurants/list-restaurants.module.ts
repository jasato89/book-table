import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRestaurantsPageRoutingModule } from './list-restaurants-routing.module';

import { ListRestaurantsPage } from './list-restaurants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListRestaurantsPageRoutingModule
  ],
  declarations: [ListRestaurantsPage]
})
export class ListRestaurantsPageModule {}
