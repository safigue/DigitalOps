import { Directive, Input, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appLyncPresence]'
})
export class LyncPresenceDirective {

  @Input()
  public set userEmail(value: string) {  
    this.userName = value;
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if(isIEOrEdge) {
      this.initLyncPresence();
    }
  }

  @HostListener('mouseover') onMouseOver() {
    this.showLyncPresencePopup(this.userName);
  }

  @HostListener('mouseout') onMouseOut() {
    this.hideLyncPresencePopup();
  }

  nameCtrl: any;
  userName: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  private initLyncPresence(): void {
    this.nameCtrl = new window['ActiveXObject']("Name.NameCtrl");
    this.attachLyncPresenceChangeEvent();
  }

  private attachLyncPresenceChangeEvent(): void {
    if(this.nameCtrl) {
      this.nameCtrl.OnStatusChange = this.onLyncPresenceStatusChange;
    }
  }

  private showLyncPresencePopup(userName: string): void {
    if(this.nameCtrl) {
      const left = this.el.nativeElement['offsetLeft'];
      const top = this.el.nativeElement['offsetTop'];

      this.nameCtrl.ShowOOUI(userName, 0, left, top);
    }
  }

  private hideLyncPresencePopup(): void {
    if(this.nameCtrl) {
      this.nameCtrl.HideOOUI();
    }
  }

  private onLyncPresenceStatusChange(userName: string, status: number, id): void {
    const presenceClass = this.getLyncPresenceString(status);
    this.removePresenceClasses();
    this.renderer.addClass(this.el, presenceClass);
  }

  private removePresenceClasses(): void {
    this.renderer.removeClass(this.el, 'available');
    this.renderer.removeClass(this.el, 'offline');
    this.renderer.removeClass(this.el, 'away');
    this.renderer.removeClass(this.el, 'busy');
    this.renderer.removeClass(this.el, 'donotdisturb');
    this.renderer.removeClass(this.el, 'inacall');
  }

  private getLyncPresenceString(status): string {
    switch (status) {
      case 0:
          return 'available';
      case 1:
          return 'offline';
      case 2:
      case 4:
      case 16:
          return 'away';
      case 3:
      case 5:
          return 'inacall';
      case 6:
      case 7:
      case 8:
      case 10:
          return 'busy';
      case 9:
      case 15:
          return 'donotdisturb';
      default:
          return '';
    }
  }
}
