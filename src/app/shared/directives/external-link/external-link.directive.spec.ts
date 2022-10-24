import { ExternalLinkDirective } from './external-link.directive';
import { ElementRef } from '@angular/core';

describe('ExternalLinkDirective', () => {
  it('should create an instance', () => {
    let el: ElementRef;
    const directive = new ExternalLinkDirective(el);
    expect(directive).toBeTruthy();
  });
});
