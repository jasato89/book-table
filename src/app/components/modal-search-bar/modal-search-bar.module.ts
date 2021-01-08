import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchBarComponent } from './modal-search-bar.component';
import {FormsModule}   from '@angular/forms';


@NgModule({
  declarations: [ModalSearchBarComponent],
  exports: [ModalSearchBarComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ModalSearchBarModule { }
