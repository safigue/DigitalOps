import { Component, OnInit } from '@angular/core';
import { PageContentService } from 'src/app/shared/services/page-content/page-content.service';
import { Link } from '../../components/search/link.model';
import { SharepointService } from 'src/app/shared/services/sharepoint/sharepoint.service';
import { SolutionsStatusService } from '../../services/solution-status/solutions-status.service';
import { map, combineLatest } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {

  public externalLinks: Link[];
  public feedbackData: Link;
  public solutionsList: Array<any> = [];
  public headerLogoUrl = 'assets/images/dmwr-logo.svg';
  public othersHeaderLogoUrl = 'assets/images/dmwr-logo-others.svg'
  private nameMap = new Map();

  constructor(
    private pageService: PageContentService,
    private sharepointService: SharepointService,
    private statusService: SolutionsStatusService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Digital Manufacturing Solutions');
    this.sharepointService.getWithFilter('Digital Manufacturing Solution Statuses', '').subscribe(res => {
      this.statusService.initializeMaps(res.results);
    })

    this.pageService.getPageData('Solutions').subscribe(res => {
      this.setExternalLinks(res['Section 1']);
      this.setFeedbackData(res['Section 2'][0]);
    }, err => console.log(err));

    this.sharepointService.getFieldsWithFilter('Digital Manufacturing Solutions' , '').pipe(
      map(res => res['results']),
      combineLatest(this.sharepointService.getWithFilter('Digital Manufacturing Solutions', '?$select=*,Attachments,AttachmentFiles&$expand=AttachmentFiles')
        .pipe(map(res => res['results']))
      )
    ).subscribe(([names, solutions]) => {
      this.solutionsList = this.assignDisplayNames([...names], [...solutions]);
      this.solutionsList.sort((a: any, b: any) => {
        if(a.Order >= b.Order) {
          return 1;
        } else {
          return -1;
        }
      })
    })

    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res['isDmv']) {
        if(res['isDmv'] === 'true') {
          this.headerLogoUrl = 'assets/images/dmwr-logo.svg';
        } else {
          this.headerLogoUrl = 'assets/images/Other-DM-Solutions.svg';
        }
      } else if(res['isTurnaround']) {
        this.headerLogoUrl = 'assets/images/DM-TurnaroundSolutions.svg';
      }
    });
  }

  private assignDisplayNames(names: Array<any>, solutions: Array<any>): Array<any> {
    this.initNameMap(names);
    let newSolutions: Array<any> = [];
    solutions.forEach(solution => {
      let newSolution = {};
      Object.keys(solution).forEach(propName => {
        if(this.nameMap.get(propName)) {
          newSolution[this.nameMap.get(propName)] = solution[propName];
        } else {
          newSolution[propName] = solution[propName];
        }
        
      })
      newSolutions.push(newSolution);
    })
    return newSolutions;
  }

  private initNameMap(propNamesList: Array<any>) {
    propNamesList.forEach(propNameItem => {
      let internalName = propNameItem['InternalName'];
      if(propNameItem['LookupField']){
        internalName += 'Id';
      }
      if(!this.nameMap.get(internalName)){
        this.nameMap.set(internalName, propNameItem['Title'])
      }
    })
  }

  private setExternalLinks(data): void {
    this.externalLinks = data;
    this.externalLinks.forEach(link => {
      link["Button1"] && ( link.url = link["Button1"]["Url"]);
    })
  }

  private setFeedbackData(data): void {
    this.feedbackData = data;
    if (this.feedbackData['Button1']) {
      this.feedbackData.url = this.feedbackData['Button1']['Url'];
      this.feedbackData.Title = this.feedbackData['Button1']['Description'];
    }
  }

}
