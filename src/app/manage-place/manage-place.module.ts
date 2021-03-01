import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePlacePageRoutingModule } from './manage-place-routing.module';

import { ManagePlacePage } from './manage-place.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePlacePageRoutingModule
  ],
  declarations: [ManagePlacePage]
})
export class ManagePlacePageModule {}
