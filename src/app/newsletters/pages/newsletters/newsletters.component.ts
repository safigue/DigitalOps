import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PageContentService } from 'src/app/shared/services/page-content/page-content.service';
import { Year, Article, Month } from '../../models/article.model';
import { SharepointService } from 'src/app/shared/services/sharepoint/sharepoint.service';
import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';

const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

@Component({
  selector: 'app-newsletters',
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.css']
})
export class NewslettersComponent implements OnInit {

  subscribeLink: ExternaLink = {url: '', title: ''};
  feedbackLink: ExternaLink = {url: '', title: ''};
  isDataFetched: boolean = false;

  constructor(
    private pageService: PageContentService,
    private sharepointService: SharepointService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute) { }

  public headerLogoUrl = 'assets/images/dmwr-logo.svg';
  public years: Year[] = [];
  
  private isTest: boolean = false;

  ngOnInit() {
    this.titleService.setTitle('Digital Manufacturing Newsletters');
    this.activatedRoute.queryParams.subscribe((res: any) => {
      let isTest;
      if(typeof res['testing'] !== 'undefined'){
        isTest = res['testing'] === 'true' ? true : false;
      } else {
        isTest = false;
      }
      if(this.isTest !== isTest) {
        this.isTest = isTest;
        // if(isTest === false) {
        //   this.removeUnpublishedArticles();
        // }
        this.getNewslettersData();
      }
    })
    this.pageService.getPageData('Newsletters').subscribe(res => {
        this.subscribeLink.url= res['Section 1'][0]['Button1'] ? res['Section 1'][0]['Button1']['Url'] : '';
        this.subscribeLink.title= res['Section 1'][0]['Title'];

        this.feedbackLink.url = res['Section 1'][1]['Button1'] ? res['Section 1'][1]['Button1']['Url'] : '';
        this.feedbackLink.title = res['Section 1'][1]['Button1'] ? res['Section 1'][1]['Button1']['Description'] : '';
      }, err => console.log(err))

    this.getNewslettersData();
  }

  private getNewslettersData(): void {
    // this.years.length = 0;
    let filterQuery = '';
    if(!this.isTest) {
      filterQuery = '&$filter= Published eq \'Yes\'';
    }
    this.sharepointService.getWithFilter('Digital Manufacturing Newsletters', '?$select=*,Attachments,AttachmentFiles&$expand=AttachmentFiles'+filterQuery)
      .subscribe(res => {
        this.transformNewsletterData(res['results']);
        this.isDataFetched = true;
      })
  }

  // private removeUnpublishedArticles(): void {
  //   this.years.forEach(year => {
  //     year.months.forEach(month => {
  //       let articlesToRemove = [];
  //       month.articles.forEach((article, index) => {
  //         if(!article.published){
  //           articlesToRemove.push(index);
  //         }
  //       })
  //       articlesToRemove.forEach(index => {
  //         month.articles.splice(index, 1);
  //       })
  //     })
  //   })
  //   //Remove months that have zero published articles
  //   this.years.forEach(year => {
  //     let monthsToRemove: Array<number> = [];
  //     year.months.forEach((month, index: number) => {
  //       let publishedArticleCount:number = 0;
  //       month.articles.forEach(article => {
  //         if(article.published) {
  //           publishedArticleCount += 1;
  //         }
  //       })
  //       if(publishedArticleCount === 0){
  //         monthsToRemove.push(index);
  //       }
  //     })
  //     monthsToRemove.forEach(monthIndex => {
  //       year.months.splice(monthIndex, 1);
  //     })
  //   })
  // }

  private transformNewsletterData(newsletters: Array<any>): void {
    this.years  = [];
    newsletters.forEach(newsletter => {
      const year = this.years.find( year => year.name === newsletter.Year);
      //if year is found
      if(typeof year !== 'undefined'){
        const month = year.months.find( month => month.name === newsletter.Month)
        //if month is found
        if(month) {
          const article = this.setArticle(newsletter);
          // if(article.published) {
            if(month.articles.findIndex(art => art.title === article.title) === -1) { 
              month.articles.push(article); 
            }
          // }
        } else {
          let newMonth: Month = <Month>{};
          newMonth = this.setMonth(newsletter);
          const article = this.setArticle(newsletter);
          // if(article.published) {
            if(newMonth.articles.findIndex(art => art.title === article.title) === -1) { 
              newMonth.articles.push(article); 
            }
          // }
          year.months.push(newMonth);
        }
      } else {
        let newYear: Year = <Year>{};
        newYear.name = newsletter.Year;
        newYear.months = [];
        let newMonth: Month = <Month>{};
        newMonth = this.setMonth(newsletter);
        const article = this.setArticle(newsletter);
        // if(article.published) {
          if(newMonth.articles.findIndex(art => art.title === article.title) === -1) { 
            newMonth.articles.push(article); 
          }
        // }
        newYear.months.push(newMonth);
        this.years.push(newYear);
      }
    })

    //Sorting years in reverese chronological order
    this.years.sort((a: Year, b: Year) => {
      if(parseInt(a.name) <= parseInt(b.name)) {
        return 1;
      } else {
        return -1;
      }
    })


    //Sorting months in reverse chronological order
    this.years.forEach(year => {
      year.months.sort((a: Month, b: Month) => {
        if(Months.indexOf(a.name) <= Months.indexOf(b.name)) {
          return 1;
        } else {
          return -1;
        }
      })
    })


    //Sort articles on the basis of order provided by user
    this.years.forEach(year => {
      year.months.forEach(month => {
        month.articles.sort((a: Article, b: Article) => {
          if(a.order >= b.order) {
            return 1;
          } else {
            return -1;
          }
        })
      })
    })
  }

  

  private setArticle(newsletter: any): Article {
    let article: Article = <Article>{};
    article.title = newsletter['Title'];
    article.order = newsletter['Order0'];
    article.published = newsletter['Published'] === 'Yes' ? true : false; 
    
    //This line removes unnecessary unicode conversion in html string that could cause UI problems
    article.description = newsletter['Description'] ? newsletter['Description'].toString().replace(/[\u200B]/g, '') : '';

    if(article.description.length > 0) {
      let descElement = document.createElement('div');
      descElement.innerHTML = article.description;
      article.shortDescription = descElement.children[0]['innerText'].toString()
    } else {
      article.shortDescription = '';
    }
    article.image = '';
    newsletter['Attachments'] && ( article.image = environment.fileBaseUrl + newsletter['AttachmentFiles']['results']['0']['ServerRelativeUrl']);
    article.id = newsletter['Id'];
    if(newsletter['Video']) {
      article.videoUrl = newsletter['Video']['Url'];
      article.hasVideo = true;
    } else {
      article.videoUrl = '';
      article.hasVideo = false;
    }
    return article;
  }

  private setMonth(newsletter: any): Month {
    let newMonth: Month = <Month>{};
    newMonth.isTabActive = false;
    newMonth.name = newsletter['Month'];
    newMonth.articles = [];
    return newMonth;
  }

}

interface ExternaLink {
  url: string
  title: string
}