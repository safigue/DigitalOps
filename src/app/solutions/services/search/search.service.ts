import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private queryParams = new BehaviorSubject({});
  public currentQueryParams= this.queryParams.asObservable();

  constructor() { }

  public updateQueryParams(params: {}) {
    this.queryParams.next(params);
  }

}