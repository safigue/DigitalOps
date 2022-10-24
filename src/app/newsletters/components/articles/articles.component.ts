import { Component, OnInit, ViewChild, Input, HostListener, AfterViewInit } from '@angular/core';
import {style, animate, transition, trigger} from '@angular/animations';
import { ArticleModalService } from '../../services/article-modal/article-modal.service';
import { Month, Year, Article } from '../../models/article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SharepointService } from 'src/app/shared/services/sharepoint/sharepoint.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(500, style({opacity:1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({opacity:0})) 
      ])
    ])
  ]
})
export class ArticlesComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.viewportWidth = window.innerWidth;
    this.alterSwiperNav();
  }

  @ViewChild('swiper', { static: false, read: SwiperDirective }) swiperDirective: SwiperDirective;
  

  @Input() feedback: ExternaLink;
  @Input() subscribe: ExternaLink;
  @Input()
  set years(value: Year[]) {
    this._years = [];
    this._years = value;
    this.activeMonth = this._years[0].months[0];
    this.activeYear = this._years[0];
    this.changeQueryParams();
  }
  public _years: Year[];
  public slides: Article[] = [];
  public showContentIndex: boolean = false;
  public isUserSubscribed: boolean = false;
  public showSubscriptionDetails: boolean = false;
  public activeMonth: Month;
  public activeYear: Year;
  public isModalOpen: boolean = false;
  public showNavigation: boolean = true;
  public config : SwiperConfigInterface = {};
  public showSwiper: boolean = false;
  public subscribeAlert: string = '';
  public disablePreviousMonthButton: boolean = false;
  public disableNextMonthButton: boolean = false;
  
  private viewportWidth: number;
  private userDetails: any;
  private currentMonthIndex: number;
  private currentYearIndex: number;

  constructor(
    private articleService: ArticleModalService,
    private activatedRoute: ActivatedRoute,
    private sharepointService: SharepointService,
    private router: Router) {}
  
  ngOnInit() {
    this.viewportWidth = window.innerWidth;
    this.alterSwiperNav();

    this.activatedRoute.queryParams.subscribe((res: any) => {
      if(Object.keys(res).length !== 0) {
        this.showSwiper = false;
        this.setCurrentYearAndMonth(res);
        this.alterMonthNavigationButtons();
        this.setSwipperSlides();
        this.alterSwiperNav();
        if(res['article']) {
          this.showArticleModal(this.getArticle(+res['article']))
        }
      } else {
        this.changeQueryParams();
      }
    })

    this.articleService.getModalState.subscribe(res => {
      this.isModalOpen = res;
    })

    this.checkIsUserSubscribed();

  }

  ngAfterViewInit() {
    this.swiperDirective.update();
  }

  private setCurrentYearAndMonth(data): void {
    this.activeYear = this._years.find(year => year.name === data.year);
    this.activeMonth = this.activeYear.months.find(month => month.name === data.month);
    this.currentMonthIndex = this.activeYear.months.findIndex((month: Month) => this.activeMonth.name === month.name)
    this.currentYearIndex = this._years.findIndex((year: Year) => year.name === this.activeYear.name);
  }

  private alterSwiperNav(): void {
    if(this.viewportWidth > 992) {
      if(this.slides.length <= 4){
        this.showNavigation = false;
        this.config.slidesPerView = this.slides.length;
      } else {
        this.showNavigation = true;
      }
    } else if(this.viewportWidth > 640 ) {
      if(this.slides.length <= 2){
        this.showNavigation = false;
        this.config.width = 400;
      } else {
        this.showNavigation = true;
      }
    } else if(this.viewportWidth > 480 ) {
      if(this.slides.length <= 1){
        this.showNavigation = false;
      } else {
        this.showNavigation = true;
      }
    } else {
      this.showNavigation = true;
    }
    if(typeof this.swiperDirective !== 'undefined') {
      this.swiperDirective.update();
      this.swiperDirective.setIndex(0,10,true);
    }
  }

  

  private setSwipperSlides(): void {
    this.slides = [ ...this.activeMonth.articles ];
    if(typeof this.swiperDirective !== 'undefined') {
      this.swiperDirective.update();
      this.swiperDirective.setIndex(0,10,true);
    }
  }

  private checkIsUserSubscribed(): void {
    this.showSubscriptionDetails = false;
    this.sharepointService.getUser()
      .pipe(map(res => res.d))
      .subscribe((res: any) => {
        this.userDetails = res;
        this.userDetails['UserProfileProperties']['results'].forEach((userProps) => {
          if(userProps.Key === 'Department'){
            this.userDetails['BusinessName'] = userProps['Value'];
          }
        })
        this.sharepointService.getWithFilter('Subscriber List', `?$filter=email_x0020_Address eq '${res.Email}'` )
          .subscribe((res: any) => {
            this.isUserSubscribed = res.results.length !== 0 ? true : false;
          });
      });
      this.showSubscriptionDetails = true;
  }

  private getArticle(articleId: number): Article {
    return this.activeMonth.articles.find(article => article.id === articleId);
  }

  private alterMonthNavigationButtons(): void {
    if(this.currentMonthIndex === 0 && this.currentYearIndex === 0) {
      this.disableNextMonthButton = true;
    } else if(
      this.currentMonthIndex === this.activeYear.months.length - 1 &&
      this.currentYearIndex === this._years.length - 1) {
      this.disablePreviousMonthButton = true;
    } else {
      this.disableNextMonthButton = false;
      this.disablePreviousMonthButton = false;
    }
  }

  private changeQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        month: this.activeMonth.name,
        year: this.activeYear.name
      },
      queryParamsHandling: 'merge'
    })
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public showArticleModal(selectedArticle: Article): void {
    this.articleService.updateModalContent(selectedArticle);
    this.articleService.updateModalState(true);
  }

  public addToSubscribersList(): void {
    this.sharepointService
      .addItem('Subscriber List', 
        { Title: this.userDetails.DisplayName, 
          email_x0020_Address: this.userDetails.Email, 
          Business: this.userDetails.BusinessName })
      .subscribe(res => {
          this.isUserSubscribed = true;
          this.showSubscribeAlert();
        }, 
        err => console.log(err)
      );
  }

  public removeFromSubscribersList(): void {
    this.sharepointService.getWithFilter('Subscriber List', `?$filter=email_x0020_Address eq '${this.userDetails.Email}'` )
      .subscribe((res: any) => {
        this.sharepointService.deleteItemFromList('Subscriber List', res.results[0].Id)
          .subscribe(res => {
            this.isUserSubscribed = false;
            this.showSubscribeAlert();
          }, 
            err => console.log(err)
          );
      });
  }

  public showSubscribeAlert(): void {
    if(this.isUserSubscribed) {
      this.subscribeAlert = 'Subscribed to newsletter'
    } else {
      this.subscribeAlert = 'Unsubscribed to newsletter'
    }
    setTimeout(() => {
      this.subscribeAlert = ''
    },3000)
  }

  public changeCurrentMonth(shiftMonthIndexBy: number): void {
    if(this.currentMonthIndex === 0) {
      if(shiftMonthIndexBy === -1){
        if(this.currentYearIndex !== 0) {
          this.currentYearIndex += shiftMonthIndexBy;
          this.activeYear = this._years[this.currentYearIndex];
          this.currentMonthIndex = this.activeYear.months.length - 1;
          this.activeMonth = this.activeYear.months[this.currentMonthIndex];
        }
      } else if(shiftMonthIndexBy === 1) {
        this.currentMonthIndex += shiftMonthIndexBy;
        this.activeMonth = this.activeYear.months[this.currentMonthIndex];
      }
    } else if(this.currentMonthIndex === this.activeYear.months.length - 1) {
      if(shiftMonthIndexBy === -1){
        this.currentMonthIndex += shiftMonthIndexBy;
        this.activeMonth = this.activeYear.months[this.currentMonthIndex];
      } else if(shiftMonthIndexBy === 1) {
        if(this.currentYearIndex !== this._years.length - 1){
          this.currentYearIndex += shiftMonthIndexBy;
          this.activeYear = this._years[this.currentYearIndex];
          this.currentMonthIndex = 0;
          this.activeMonth = this.activeYear.months[this.currentMonthIndex];
        }
      }
    } else {
      this.currentMonthIndex += shiftMonthIndexBy;
      this.activeMonth = this.activeYear.months[this.currentMonthIndex];
    }

    this.changeQueryParams();
  }

}


interface ExternaLink {
  url: string
  title: string
}
