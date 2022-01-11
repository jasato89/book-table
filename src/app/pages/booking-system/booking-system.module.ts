import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingSystemPageRoutingModule } from './booking-system-routing.module';

import { BookingSystemPage } from './booking-system.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPaginationModule,
    BookingSystemPageRoutingModule
  ],
  declarations: [BookingSystemPage]
})
export class BookingSystemPageModule {}
