import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpStatus } from './http-status';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];

  constructor(private status: HttpStatus) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1); // This removes the request from our array
    }
    // Let's tell our loader of the updated status
    this.status.setStatus(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.status.setStatus(false);
    return Observable.create(observer => {
      const subscription = next.handle(req).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.removeRequest(req);
          observer.next(event);
        }
        console.log(event);
      },
        err => { this.removeRequest(req); observer.error(err); },
        () => { this.removeRequest(req); observer.complete(); }
      );
      return () => {
        this.removeRequest(req);
        this.status.setStatus(this.requests.length === 0);
        subscription.unsubscribe();
      };
    });
  }

}
