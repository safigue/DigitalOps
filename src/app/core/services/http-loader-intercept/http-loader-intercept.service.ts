import { Injectable } from '@angular/core';
import { HttpLoaderService } from '../http-loader/http-loader.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpLoaderInterceptService {

  private totalPendingRequests = 0;

  constructor(private loaderService: HttpLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalPendingRequests++;
    this.showLoader();
    return next.handle(req).pipe(
      tap( (event: HttpEvent<any>) => { 
        if (event instanceof HttpResponse) {
          this.decreasePendingRequests()
        }
      }), catchError(err => {
        this.decreasePendingRequests();
        throw err;
      })
    );
  }

  private showLoader(): void {
    this.loaderService.show();
  }
  private hideLoader(): void {
    this.loaderService.hide();
  }

  private decreasePendingRequests(): void {
    this.totalPendingRequests--;
    if(this.totalPendingRequests === 0) {
      this.hideLoader();
    }
  }

}
