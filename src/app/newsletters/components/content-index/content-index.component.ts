import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ArticleModalService } from '../../services/article-modal/article-modal.service';
import { Year, Month, Article } from '../../models/article.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-content-index',
  templateUrl: './content-index.component.html',
  styleUrls: ['./content-index.component.css']
})
export class ContentIndexComponent implements OnInit{

  public openContentIndex: boolean = false;

  @Input() 
  set years(value: Year[]) {
    this._years = [...value];
    this.getMonthAndYearFromParams();
  }
  public _years: Year[] = [];
  private selectedYear: Year;
  private selectedMonth: Month;
  public closeIcon: string = 'assets/images/icon-close-blue.png';
  private isTest: boolean = false;

  constructor(
    private articleService: ArticleModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // this.getMonthAndYearFromParams();
  }

  private getMonthAndYearFromParams(): void {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if(Object.keys(res).length !== 0) {
        this.selectedYear = this._years.find(year => year.name === res.year);
        this.selectedMonth = this.selectedYear.months.find(month => month.name === res.month);
        this.alterTabOnQueryChange(this.selectedYear, this._years);
        this.alterTabOnQueryChange(this.selectedMonth, this.selectedYear.months);
        // if(typeof this.selectedYear === 'undefined' || this.selectedYear.name !== res.year) {
        //   this.selectedYear = this._years.find(year => year.name === res.year);
        //   this.alterYearView(this.selectedYear, this._years);
        // }
        // if(typeof this.selectedMonth === 'undefined' || this.selectedMonth.name !== res.month) {
        //   this.selectedMonth = this.selectedYear.months.find(month => month.name === res.month);
        //   this.alterMonthView(this.selectedMonth, this.selectedYear.months);
        // }
      }
    })
  }

  private alterTabOnQueryChange(tabClicked: Year | Month, allTabs: Year[] | Month[]): void {
    if(tabClicked){
      const tabName = tabClicked.name;
      allTabs.forEach(tab => {
        if(tab.name === tabName) {
          tab.isTabActive = true;
        } else {
          tab.isTabActive = false;
        }
      });
    }
  }

  private alterTab(tabClicked: Year | Month, allTabs: Year[] | Month[]): void {
    const initialState = tabClicked.isTabActive;
    allTabs.forEach(tab => tab.isTabActive = false);
    tabClicked.isTabActive = !initialState;
  }

  public setSelectedYear(year: Year, years: Year[]): void {
    this.alterYearView(year, years);
    this.selectedYear = year;
  }

  public setSelectedMonth(month: Month, year: Year): void {
    if(month.name !== this.selectedMonth.name || year.name !== this.selectedYear.name) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          year: year.name,
          month: month.name
        },
        queryParamsHandling: 'merge'
      })
    } else {
      this.alterMonthView(month, year.months);
    }
  }

  public openContentMenu(): void {
    this.openContentIndex = true;
  }

  public closeContentMenu(): void {
    this.openContentIndex = false;
  }

  public alterYearView(yearClicked: Year, years: Year[]): void {
    yearClicked.months.forEach(month => month.isTabActive = false)
    this.alterTab(yearClicked, years);
  }

  public alterMonthView(monthClicked: Month, months: Month[]): void {
    this.alterTab(monthClicked, months);
  }

  public openArticleModal(selectedArticle: Article): void {
    this.closeContentMenu();
    this.articleService.updateModalContent(selectedArticle);
    this.articleService.updateModalState(true);
  }

}


