import { Component, OnInit, Input} from '@angular/core';
import { Link } from './link.model'

@Component({
  selector: 'app-link-group',
  templateUrl: './link-group.component.html',
  styleUrls: ['./link-group.component.css']
})
export class LinkGroupComponent implements OnInit {

  constructor() { }

  @Input() links: Link[]

  ngOnInit() {
  }

}
