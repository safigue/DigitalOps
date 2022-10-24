import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolutionsStatusService {

  public statusColorMap = new Map();
  public statusIndexMap = new Map();
  public statusDescriptionMap = new Map();
  public maxId: number = 0;

  constructor() { }

  initializeMaps(data): void {
    data.forEach(el => {
      this.statusColorMap.set(el.Title, el['Status_x0020_Color']);
      this.statusDescriptionMap.set(el.Title, el['Description'])
      this.statusIndexMap.set(el.Id, el.Title);
      if(el.Id  > this.maxId) {
        this.maxId = el.Id;
      }
    });
  }
}
