import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantsTopicsPageRoutingModule } from './restaurants-topics-routing.module';

import { RestaurantsTopicsPage } from './restaurants-topics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantsTopicsPageRoutingModule
  ],
  declarations: [RestaurantsTopicsPage]
})
export class RestaurantsTopicsPageModule {}
