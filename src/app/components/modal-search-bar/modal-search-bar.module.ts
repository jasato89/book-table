import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchBarComponent } from './modal-search-bar.component';
import {FormsModule}   from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [ModalSearchBarComponent],
  exports: [ModalSearchBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class ModalSearchBarModule { }
