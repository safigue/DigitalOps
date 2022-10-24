import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewslettersComponent } from './pages/newsletters/newsletters.component';


const routes: Routes = [
  {
    path: '',
    component: NewslettersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewslettersRoutingModule { }
