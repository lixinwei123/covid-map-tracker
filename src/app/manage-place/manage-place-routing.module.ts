import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePlacePage } from './manage-place.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePlacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePlacePageRoutingModule {}
