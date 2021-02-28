import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoCompletePage } from './auto-complete.page';

const routes: Routes = [
  {
    path: '',
    component: AutoCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoCompletePageRoutingModule {}
