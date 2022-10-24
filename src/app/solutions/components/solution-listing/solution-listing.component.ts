import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../search/link.model';
import { combineLatest} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DetailModalService } from '../../services/detail-modal/detail-modal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solution-listing',
  templateUrl: './solution-listing.component.html',
  styleUrls: ['./solution-listing.component.css']
})
export class SolutionListingComponent implements OnInit {

  private dataSource: Subject<Array<any>> = new Subject<Array<any>>();
  @Input() feedbackLink: Link;
  @Input() 
  public set solutions(value: any) {
    this.dataSource.next(value);
  }

  public filteredSolutions: Array<any>;
  public openModal: boolean = false;
  public openStatusModal: boolean = false;
  public showSolutionsDetail: boolean = false;
  
  
  constructor(
    private modalService: DetailModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.dataSource.pipe(
      // combineLatest(this.searchService.currentQueryParams)
      combineLatest(this.activatedRoute.queryParams)
    ).subscribe(([data, params]) => {
      this.filteredSolutions = Object.keys(params).length === 0 ? data : this.filterSolutions(params, data);
    });

    this.modalService.getModalState.subscribe(res => this.showSolutionsDetail = res)
  }

  // Filter Solutions on Title, Description, Value, Device Dependencies
  private filterSolutions(params, data): Array<any> {
    let filteredData;
    // Filter solutions based on Is DMV if it is present in query
    if(typeof params.isDmv !== 'undefined'){
      filteredData = data.filter(solution => solution['Is DMV Solution'].toString() === params.isDmv);
    }
    
    // Filter solutions based on Is Turn around if it is present in query
    if(typeof params.isTurnaround !== 'undefined') {
      filteredData = data.filter(solution => solution['Is Turnaround Solution'].toString() === params.isTurnaround)
    }

    if(typeof params.searchQuery !== 'undefined' && params.searchQuery.length !== 0) {
      return this.filterBySearchQuery(filteredData, params.searchQuery);
    } else {
      return filteredData;
    }
  }

  private filterBySearchQuery(solutions, searchQuery: string): Array<any> {
    const queries = searchQuery.toLowerCase().split(' ');
    let results = [];
    queries.forEach((query: string) => {
      query.trim();
      const filteredSolutions = solutions.filter(solution => {
        const devices = solution['Device Dependency'] ? solution['Device Dependency'].results.join('').toLowerCase() : '';
        if( 
          solution['Title'] && solution['Title'].toLowerCase().includes(query) 
          || solution['Description'] && solution['Description'].toLowerCase().includes(query)
          || solution['Value'] && solution['Value'].toLowerCase().includes(query)
          || devices.includes(query)){
          return solution;
        }
      })

      filteredSolutions.forEach(solution => {
        if ( !results.find(res => res.Id === solution.Id) ) {
          results.push(solution)
        }
      })

    });
    return results;
  }

  

}
