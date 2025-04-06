import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenav!: MatSidenav;

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  openSidenav() {
    console.log(this.sidenav)
    this.sidenav?.open();
  }

  closeSidenav() {
    this.sidenav?.close();
  }

  toggleSidenav() {
    this.sidenav?.toggle();
  }
}