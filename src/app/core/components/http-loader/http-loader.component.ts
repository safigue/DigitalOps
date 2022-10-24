import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpLoaderService } from '../../services/http-loader/http-loader.service';
import { LoaderState } from './loader.model';

@Component({
  selector: 'app-http-loader',
  templateUrl: './http-loader.component.html',
  styleUrls: ['./http-loader.component.css']
})
export class HttpLoaderComponent implements OnInit, OnDestroy{

  show = false;
  private subscription: Subscription;
  constructor(private loaderService: HttpLoaderService) { }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
