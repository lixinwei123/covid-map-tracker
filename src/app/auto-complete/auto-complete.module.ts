import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutoCompletePageRoutingModule } from './auto-complete-routing.module';

import { AutoCompletePage } from './auto-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutoCompletePageRoutingModule
  ],
  declarations: [AutoCompletePage]
})
export class AutoCompletePageModule {}
