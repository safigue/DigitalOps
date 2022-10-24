import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { DetailModalService } from '../../services/detail-modal/detail-modal.service';
import { Subscription, forkJoin } from 'rxjs';
import { SolutionsStatusService } from '../../services/solution-status/solutions-status.service';
import { RestApiService } from 'src/app/shared/services/rest-api/rest-api.service';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-solution-details',
  templateUrl: './solution-details.component.html',
  styleUrls: ['./solution-details.component.css']
})
export class SolutionDetailsComponent implements OnInit {

  public showModal: boolean = false;
  public modalData: any;
  public referencesLinks: Array<any>;
  public contacts: Array<Contact> = [];
  public userDesignations: Array<string> = [
    'Americas_x0020_BSA',
    'EMEAP_x0020_BSA',
    'PE_x0020_Contact',
    'Global_x0020_Tool_x0020_Owner'
  ]
  public closeIcon: string = 'assets/images/icon-close.svg';
  
  //statusList holds filtered status list
  public statusList: Array<any> = [];

  //_statusList holds original status list
  public _statusList: Array<any> = [];

  public modalStateSub: Subscription;
  public modalContentSub: Subscription;
  public openStatusModal: boolean = false;
  public statusCounts = new Map();
  public statusSearchQuery: string = '';
  public statusColors = new Map();

  constructor(
    private modalService: DetailModalService, 
    private statusService: SolutionsStatusService,
    private restService: RestApiService,
    private renderer: Renderer2) { }

  ngOnInit() {

    this.renderer.addClass(document.body, 'em-is-disabled')

    this.statusColors = this.statusService.statusColorMap;

    this.modalStateSub = this.modalService.getModalState.subscribe(res => {
      this.showModal = res;
    });

    this.modalContentSub = this.modalService.getModalContent.subscribe(res => {
      this.modalData = res;
      if(!this.modalData['Activity Link']){
        this.modalData['Activity Link'] = '';
      }
      this._statusList = [];
      this.statusList = [];
      this.statusCounts.clear();

      this.processStatusData(res);
      this.countStatus();
      if (Object.keys(this.modalData).length !== 0) {
        this.getReferencesLinks();
        this.getContacts();
      }
    });
    
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'em-is-disabled')
    this.modalStateSub.unsubscribe();
    this.modalContentSub.unsubscribe();
  }

  private getContacts(): void {
    this.contacts = [];
    this.userDesignations.forEach(user => {
      const expandTitleQuery = `$select=${user}/Title&$expand=${user}&$filter=Id eq ${this.modalData.ID}`;
      const expandEmailQuery = `$select=${user}/EMail&$expand=${user}&$filter=Id eq ${this.modalData.ID}`;
      
      const titleReq = this.restService.get(`${environment.sharepointBaseUrl}_api/web/lists/getByTitle('Digital Manufacturing Solutions')/items?${expandTitleQuery}`)
        .pipe(
          map(res => res.d.results[0][user]),
          take(1)
        );

      const emailReq = this.restService.get(`${environment.sharepointBaseUrl}_api/web/lists/getByTitle('Digital Manufacturing Solutions')/items?${expandEmailQuery}`)
        .pipe(
          map(res => res.d.results[0][user]),
          take(1)
        );

      forkJoin([titleReq, emailReq])
      .subscribe(res => {
        if(typeof res[0]['Title'] !== 'undefined'){
          this.contacts.push({
            title: res[0]['Title'],
            email: res[1]['EMail'],
            profilePicture: `${environment.sharepointBaseUrl}_layouts/15/userphoto.aspx?size=L&accountname=${res[1]['EMail']}`,
            designation: this.getContactDesignation(user)
          })
        }
      })
    })

  }

  private getReferencesLinks(): void {
    const api = `_api/web/lists/getByTitle('Digital Manufacturing Solution References')/items`;
    const expandQuery = `$expand=Solution&$filter=Solution/Id eq ${this.modalData.ID}`;
    this.restService.get(`${environment.sharepointBaseUrl}${api}?$select=Title,Reference,Order,Solution/Id&${expandQuery}`)
    .pipe(
      map(res => res.d),
      take(1)
    )
    .subscribe(res => {
      this.referencesLinks = res.results;
    })
  }

  private countStatus(): void {
    this.statusList.forEach(status => {
      if( typeof status[ Object.keys(status)[0] ]  !== 'undefined'){
        if( typeof this.statusCounts.get(status[ Object.keys(status)[0] ]) !== 'undefined' ){
          this.statusCounts.set(status[ Object.keys(status)[0] ], this.statusCounts.get(status[ Object.keys(status)[0] ]) + 1);
        } else {
          this.statusCounts.set(status[ Object.keys(status)[0] ], 1);
        }
      }
    })
  }

  private filterStatus(searchQuery: string, data): Array<any> {
    const queries = searchQuery.toLowerCase().trim().split(' ');
    let res = [];
    queries.forEach(query => {
      data.forEach(status => {
        if(Object.keys(status)[0].toLowerCase().includes(query)) {
          let x = {};
          x[Object.keys(status)[0]] = status[Object.keys(status)[0]];
          res.push(x);
        }
      })
    })
    return res;
  }

  public getContactName(designation: string): string {
    let name = '';
    this.contacts.forEach(contact => {
      if(Object.keys(contact)[1] === designation){
        contact[designation]['Title'] && (name = contact[designation]['Title']);
      }
    })
    return name;
  }

  public getContactDesignation(designationName: string) {
    return designationName.replace(/(_x0020_)/g, ' ')
  }

  public statusSearchQueryChange(query: string): void {
    this.statusList = this.filterStatus(query, this._statusList);
  }

  public hideModal(): void {
    this.modalService.updateModalState(false);
    this.openStatusModal = false;
  }

  public getStatusColor(status: string): string {
    return this.statusColors.get(status);
  }

  public getStatusDescription(status: string): string {
    return this.statusService.statusDescriptionMap.get(status);
  }

  public getObjectProperty(obj: any): string{
    return Object.keys(obj)[0];
  }

  public getProfilePicture(contact: Contact): string {
    return `url(${encodeURI(contact.profilePicture)})`
  }

  public processStatusData(data: any): void {
    const filterList = [
      'ID',
      'Id',
      'FileSystemObjectType',
      'EditorId',
      'AuthorId',
      'Order'
    ]
    const list = [];
    for(let status in data) {
      if(data.hasOwnProperty(status)) {
        if(typeof data[status] === 'number' && !filterList.includes(status) && data[status] <= this.statusService.maxId){
          let x = {};
          x[status] = this.statusService.statusIndexMap.get(data[status])
          list.push(x);
        }
      }
    }

    this.statusList = [...list];
    this._statusList = [...list];
  }

}

interface Contact {
  title: string
  email: string
  profilePicture: string,
  designation: string
}
