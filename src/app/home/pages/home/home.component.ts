import { Component, OnInit } from '@angular/core';
import { Banner } from 'src/app/home/components/banner/banner.model';
import { Link } from '../../components/link-group/link.model';
import { PageContentService } from 'src/app/shared/services/page-content/page-content.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public bannerData: Banner;
  public headerLogoUrl = 'assets/images/dmwr-logo.svg';

  public externalLinks: Link[] = [];

  constructor(private pageService: PageContentService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Digital Manufacturing Home');
    this.pageService.getPageData('Home').subscribe(
      res => {
        this.setBannerData(res['Section 1'][0]);
        this.setLinks(res['Section 2']);
      }
      , err => console.log(err))
  }

  public setBannerData(res: any): void {
    this.bannerData = res;
    this.bannerData.imgSrc = environment.fileBaseUrl + res["AttachmentFiles"]["results"][0]["ServerRelativeUrl"];
  }

  public setLinks(res: any): void {
    this.externalLinks = res;
    this.externalLinks.forEach(link => { 
      link.imgSrc = link['Attachments'] && ( environment.fileBaseUrl + link["AttachmentFiles"]["results"][0]["ServerRelativeUrl"] )
      link.url = link["Button1"]["Url"];
      link.Title = link['Button1']['Description'];
    })
  }
  
}
