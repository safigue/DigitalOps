import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpLoaderComponent } from './components/http-loader/http-loader.component';
import { HttpInterceptorService } from '../shared/services/interceptor/http-interceptor.service';
import { HttpStatus } from '../shared/services/interceptor/http-status';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpLoaderInterceptService } from './services/http-loader-intercept/http-loader-intercept.service';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, HttpLoaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  providers: [ 
    HttpInterceptorService,
    HttpStatus,
    { provide: HTTP_INTERCEPTORS, 
      useClass: HttpLoaderInterceptService,
      multi: true }
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    HttpLoaderComponent
  ]
})
export class CoreModule { }
