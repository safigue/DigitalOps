import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { LinkGroupComponent } from './components/link-group/link-group.component';
import { CoreModule } from '../core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { BannerComponent } from './components/banner/banner.component';


@NgModule({
  declarations: [HomeComponent, LinkGroupComponent, BannerComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    HttpClientModule,
    CoreModule
  ]
})
export class HomeModule { }
