import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleModalService } from '../../services/article-modal/article-modal.service';

@Component({
  selector: 'app-article-slide',
  templateUrl: './article-slide.component.html',
  styleUrls: ['./article-slide.component.css']
})
export class ArticleSlideComponent implements OnInit, AfterViewInit {

  @Input() 
  set article(value: Article) {
    this.item = value;
    if(this.item.hasVideo){
      this.readOrWatch = 'Watch Video';
      this.item.image = 'assets/images/DM-videothumbnail.jpg'
    } else {
      this.readOrWatch = 'Read More';
    }
    setTimeout(() => {
      this.checkDescriptionContentHeight();
    }, 0);
  };

  public item: Article;
  public readOrWatch: 'Read More' | 'Watch Video';

  @ViewChild('descriptionContainer', { static: false , read: HTMLElement}) descriptionContainer: HTMLElement;
  @ViewChild('descriptionText', { static: false , read: HTMLElement}) descriptionText: HTMLElement;

  public showEllipsis: boolean = false;

  constructor(private articleService: ArticleModalService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.checkDescriptionContentHeight();
  }

  private checkDescriptionContentHeight(): void {
    if(this.descriptionContainer && this.descriptionText) {
      if( this.descriptionText['nativeElement'].offsetHeight > this.descriptionContainer['nativeElement'].offsetHeight) {
        this.showEllipsis = true;
      }
    }
  }

  public getBackgroundImageUrl(imageUrl: string): string{
    return `url(${encodeURI(imageUrl)})`;
  }

  public showArticleModal(selectedArticle: Article): void {
    this.articleService.updateModalContent(selectedArticle);
    this.articleService.updateModalState(true);
  }

}
