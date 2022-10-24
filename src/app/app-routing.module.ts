import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolutionsModule } from './solutions/solutions.module'


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'solutions',
    loadChildren: () => import('./solutions/solutions.module').then(m => m.SolutionsModule)
  },
  {
    path: 'newsletters',
    loadChildren: () => import('./newsletters/newsletters.module').then(m => m.NewslettersModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
