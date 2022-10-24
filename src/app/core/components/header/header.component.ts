import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() logoUrl: string;
  currentUrl: string;
  openHeader: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.currentUrl = this.router.url.indexOf('?') ? this.router.url.split('?')[0] : this.router.url;
  }

  public handleHeaderClick(): void {
    const currentUrl = location.href.split('#')[1];
    if(!currentUrl.includes('solutions')) {
      this.router.navigate(['/home'])
    }
  }

}
