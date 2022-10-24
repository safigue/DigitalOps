import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleModalService {

  showModal = new BehaviorSubject<boolean>(false);
  getModalState = this.showModal.asObservable();

  private modalContentSource = new BehaviorSubject({});
  public getModalContent = this.modalContentSource.asObservable();

  public yearName: string;
  public monthName: string;

  constructor() { }

  updateModalState(value: boolean): void {
    this.showModal.next(value);
  }

  updateModalContent(value: any): void {
    this.modalContentSource.next(value)
  }

  setYearAndMonth(yearName: string, monthName: string) {
    this.yearName = yearName;
    this.monthName = monthName;
  }

  getYearAndMonth(): any {
    return {
      yearName: this.yearName,
      monthName: this.monthName
    }
  }
}
