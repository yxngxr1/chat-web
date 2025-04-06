import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {
  private showSidebarButtonSubject = new BehaviorSubject<boolean>(false);
  showSidebarButton$ = this.showSidebarButtonSubject.asObservable();

  setShowSidebarButton(show: boolean) {
    this.showSidebarButtonSubject.next(show);
  }
}