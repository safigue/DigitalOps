import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailModalService {

  showModal = new BehaviorSubject<boolean>(false);
  getModalState = this.showModal.asObservable();

  private modalContentSource = new BehaviorSubject({});
  public getModalContent = this.modalContentSource.asObservable();

  constructor() { }

  updateModalState(value: boolean): void {
    this.showModal.next(value);
  }

  updateModalContent(value: any): void {
    this.modalContentSource.next(value)
  }

}
