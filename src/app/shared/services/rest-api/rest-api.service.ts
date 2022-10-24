import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RestApiService {
  private apiHeaders;

  constructor(
    private http: HttpClient
  ) {
  }

  setHeaders(headers: any) {
    this.apiHeaders = {
      headers: new HttpHeaders(headers),
      withCredentials: true
    };
  }

  delete(baseUrl, endPoint = '', queryParams = ''): Observable<any> {
    return this.http.delete<any>(`${baseUrl}${endPoint}${queryParams}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  get(baseUrl: string, endPoint: string = '', queryParams: string = '',headers?:object): Observable<any> {
    return this.http.get<any>(`${baseUrl}${endPoint}${queryParams}`, this.apiHeaders)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  post(baseUrl, endPoint: any = '', queryParams: string = '', body: any = '', headers: object = null): Observable<any> {
    if (headers) {
     this.setHeaders(Object.assign({}, {
      'withCredentials': true,
      'useXDomain': true,
      'Accept': 'application/json; odata=verbose',
      'Content-Type': 'application/json; odata=verbose'
     }, headers));
    }
    return this.http.post<any>(`${baseUrl}${endPoint}${queryParams}`, body, this.apiHeaders)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  put(baseUrl, endPoint, queryParams, body, headers: object = null): Observable<any> {
    if (headers) {
      this.setHeaders(Object.assign({}, {
       'withCredentials': true,
       'useXDomain': true,
       'Accept': 'application/json; odata=verbose',
       'Content-Type': 'application/json; odata=verbose'
      }, headers));
     }
    return this.http.put<any>(`${baseUrl}${endPoint}${queryParams}`, body, this.apiHeaders)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  

  /**
   * 
   * @param params - query params as object
   * returns       - query params as url string
   */
  generateQuery(params: object) {
    let querystring: string = '';
    for (let key in params) {
      querystring = `${querystring}${querystring ? '&' : ''}${key}=${params[key]}`;
    }
    return querystring ? `?${querystring}` : '';
  }

  /**
   * 
   * @param error :Generic error handler for rest api
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error);// A client-side or network error occurred. Handle it accordingly.
    }
  }
}
