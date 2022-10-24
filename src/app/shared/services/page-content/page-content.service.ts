// import { Injectable } from '@angular/core';
import { map, retry, tap, concatMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharepointService } from '../sharepoint/sharepoint.service';
import { Injectable } from '@angular/core';
import { PageContent, Result } from './page-content.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class PageContentService {

  projectTitleObj: any;
  noContnetInfoObj:any;
  constructor(private spService: SharepointService) { }

  /**
   * 
   * @param pageName Name of the Page on Sharepoint
   * @description Service method to fetch the `page-data` from Sharepoint
   */
  getPageData(pageName: string): Observable<any> {
    
    const queryParams = [
      `?$select=Title,Button1,Section,OrderNo,PageName,Description,Attachments,AttachmentFiles&$expand=AttachmentFiles`,
      `$filter=PageName eq '${encodeURIComponent(pageName)}'`,
      `$orderBy=OrderNo asc`,
    ].join('&');
    return this.spService.getWithFilter('Digital Manufacturing Page Content', queryParams)
      .pipe(
        map((pageContentResponse: { results: PageContent[] }) => {
          const sectionContent = {};
          pageContentResponse.results.forEach((section: PageContent) => {
            if (section.Attachments) {
              section.AttachmentFiles.results.forEach((image: Result) => {
                section.image = `${environment.fileBaseUrl}${image.ServerRelativeUrl}`
              });
            }
            if (sectionContent[section.Section]) {
              sectionContent[section.Section].push(section);
            } else {
              sectionContent[section.Section] = [section];
            }
          });
          return sectionContent;
        }),
        take(1)
      );
  }

  getProjectTitle(): Observable<any> {
    if (this.projectTitleObj) {
      return of(this.projectTitleObj);
    }
    else {
      return this.getPageData('Title').pipe(
        tap(res => {
          if (res && res['Header'])
            this.projectTitleObj = res['Header'];
        }),
        concatMap(res => {
          if (res && res['Header'])
            return of(res['Header']);
            else
            return of({});
        })
      )
    }
  }

  getNoContentInfo(): Observable<any> {
    if (this.noContnetInfoObj) {
      return of(this.noContnetInfoObj);
    }
    else {
      return this.getPageData('No Search Result').pipe(
        tap(res => {
          if (res)
            this.noContnetInfoObj = res;
        }),
        concatMap(res => {
          if (res)
            return of(res);
            else
            return of({});
        })
      )
    }
  }

}
