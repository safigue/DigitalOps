import { Component, OnInit, Renderer2 } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations';
import { ArticleModalService } from '../../services/article-modal/article-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css'],
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
export class ArticleDetailsComponent implements OnInit {

  public isOpen: boolean = false;
  public article: Article;
  public safeVideoUrl: SafeUrl;
  public linkCopiedMessage: string = '';
  public closeButtonIcon: string = 'assets/images/icon-close.svg';

  constructor(
    private articleService: ArticleModalService,
    private router: Router,
    private clipboardService: ClipboardService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2) {
     }

  ngOnInit() {
    this.renderer.addClass(document.body, 'em-is-disabled')

    this.articleService.getModalState.subscribe(res => {
      this.isOpen = res;
    });

    this.articleService.getModalContent.subscribe((res:any) => {
      this.article = res;
      /* Bypass security trust resource url for youtube links only,
      youtube links cannot be shown using html5 video tag but only with iframe */
      if(this.article.hasVideo && this.isYoutubeVideo(this.article.videoUrl)) {
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.article.videoUrl) as string;
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          article: this.article.id
        },
        queryParamsHandling: 'merge'
      })
    })

  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'em-is-disabled')
  }

  private clearQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        article: null
      },
      queryParamsHandling: 'merge'
    })
  }

  public hideModal(): void {
    this.isOpen = false;
    this.clearQueryParams();
    this.articleService.updateModalState(false);
  }

  public copyArticleLinkToClipboard(): void {
    const url = location.href;
    this.clipboardService.copyFromContent(url);
    this.linkCopiedMessage = 'Url copied to clipboard';
    setTimeout(() => {
      this.linkCopiedMessage = ''
    },3000)
  }

  public isYoutubeVideo(url: string): boolean {
    return url.includes('www.youtube.com') ? true : false;
  }

}
