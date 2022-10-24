import { Injectable } from '@angular/core';
import { LoaderState } from '../../components/http-loader/loader.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpLoaderService {

  private loaderSubject = new Subject<LoaderState>();
  public loaderState = this.loaderSubject.asObservable();
  constructor() { }
  public show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  public hide() {
    setTimeout(() => {
      this.loaderSubject.next(<LoaderState>{ show: false });
    },500)
  }
}
