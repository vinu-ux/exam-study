import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasaddeditComponent } from './canvasaddedit/canvasaddedit.component';
import { CanvaslistComponent } from './canvaslist/canvaslist.component';
import { CatagoryComponent } from './catagory/catagory.component';

const routes: Routes = [
  { path: 'canvas-list/:path', component: CanvaslistComponent },
  { path: 'catagory', component: CatagoryComponent },
  { path: 'canvas', component: CanvasaddeditComponent },
  { path: 'canvas/:id', component: CanvasaddeditComponent },
  { path: '', redirectTo: '/catagory', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
