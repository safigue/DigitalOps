import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appExternalLink]'
})
export class ExternalLinkDirective{

  @Input()
  public set url(value: any){
    const internalUrlBase = location.href.split('#')[0];
    const urlToCheck = value.split('#')[0];
    if(internalUrlBase !== urlToCheck) {
      this.target = '_blank'
    }
    this.el.nativeElement.target = this.target;
  }

  private target: string = '_self';

  constructor(private el: ElementRef) {}

}
