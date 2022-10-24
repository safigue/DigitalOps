import { Component, OnInit } from '@angular/core';
import { HttpStatus } from '../../services/interceptor/http-status';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  loading = false;
  finishedAllHttpCalls: boolean;

  constructor(
    private router: Router,
    private httpStatus: HttpStatus
  ) {
    this.httpStatus.getStatus().subscribe((status: boolean) => this.finishedAllHttpCalls = status);
    this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError): {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
  }

  public setStatus(status: boolean) {
    this.finishedAllHttpCalls = status;
  }
}
