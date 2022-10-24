import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { NewslettersRoutingModule } from './newsletters-routing.module';
import { NewslettersComponent } from './pages/newsletters/newsletters.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ArticlesComponent } from './components/articles/articles.component';
import { ContentIndexComponent } from './components/content-index/content-index.component';
import { ArticleDetailsComponent } from './components/article-details/article-details.component';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";
import { ArticleSlideComponent } from './components/article-slide/article-slide.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  threshold: 50,
  spaceBetween: 30,
  slidesPerView: 4,
  setWrapperSize: false,
  centeredSlides: false,
  allowSlidePrev: true,
  allowSlideNext: true,
  preventInteractionOnTransition: false,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    '480': {
      slidesPerView: 1,
    },
    '640': {
      slidesPerView: 2,
    },
    '992': {
      slidesPerView: 2,
    }
  }
};

@NgModule({
  declarations: [NewslettersComponent, ArticlesComponent, ContentIndexComponent, ArticleDetailsComponent, ArticleSlideComponent],
  imports: [
    CommonModule,
    NewslettersRoutingModule,
    SharedModule,
    CoreModule,
    SwiperModule,
    ClipboardModule,
    NgxTextOverflowClampModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class NewslettersModule { }
