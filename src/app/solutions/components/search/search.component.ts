import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { Link } from './link.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchQuery: string = '';
  public isDmv: string;
  public isTurnaround: string;
  public searchIcon: string = 'assets/images/icon-search.svg';

  @Input() externalLinks: Link[];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.isDmv = res['isDmv'];
      this.isTurnaround = res['isTurnaround'];
      this.searchQuery = res['searchQuery'] ? res['searchQuery']: '';
    });
  }

  public checkDmvOrTurnaround(url: string): boolean {
    const searchParam = 
      this.isDmv === 'false' ? 'isDmv=false' : 
      this.isTurnaround === 'true' ? 'isTurnaround=true' : '';
    if(searchParam.length > 0) {
      if(url.includes(searchParam)) {
        return true;
      }
    }
    return false;
  }

  public onSearchQueryChange(event: string): void {
    this.searchQuery = event;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        searchQuery: this.searchQuery,
        isDmv: this.isDmv,
        isTurnaround: this.isTurnaround
      },
      queryParamsHandling: 'merge'
    })
  }

}
