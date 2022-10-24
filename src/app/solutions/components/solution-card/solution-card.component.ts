import { Component, OnInit, Input } from '@angular/core';
import { DetailModalService } from '../../services/detail-modal/detail-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-solution-card',
  templateUrl: './solution-card.component.html',
  styleUrls: ['./solution-card.component.css']
})
export class SolutionCardComponent implements OnInit {

  _solution: any;
  
  @Input()
  set solution(value: any){
    this._solution = value;
    
    let desc = document.createElement('div');
    desc.innerHTML = this._solution['Description'];
    this._solution['shortDescription'] = desc.children[0]['innerText'].toString();
    if(value['Attachments']) {
      this._solution['imgSrc'] = 'url(' + environment.fileBaseUrl + encodeURI(value['AttachmentFiles']['results']['0']['ServerRelativeUrl']) + ')';
    } else {
      this._solution['imgSrc'] = 'url(assets/images/solution-default-picture.jpg)';
    }
  }


  constructor(private modalService: DetailModalService) { }

  ngOnInit() {
  }

  showModal(): void {
    this.modalService.updateModalState(true);
    this.modalService.updateModalContent(this._solution);
  }

}
