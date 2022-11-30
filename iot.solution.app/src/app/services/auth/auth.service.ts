import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { BehaviorSubject } from 'rxjs';
import { IDSAuthService } from './idsauth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    if (this.isCheckLogin()) {
      return true;
    } else {
      this.removeAllStorage();
      this.router.navigate(['/admin']);
      return false;
    }
  }

  isCheckLogin() {
    // check if the user is logged in
    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (currentUser.userDetail.isAdmin) {
        return true;
      }
      return false;
    }
  }

  logout() {
    this.removeAllStorage();
  }

  removeAllStorage() {
    localStorage.clear();
  }

  public userFullName = new BehaviorSubject('');
  updateUserNameData = this.userFullName.asObservable();

  changeUserNameData(data: any) {
    this.userFullName.next(data);
  }
}

export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: IDSAuthService) { }

  canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state != undefined && state != null && state['url'] != undefined && state['url'] != null
      && state['url'] != '' && state['url'] != '/home' && state['url'] != '/login' && state['url'] != '/login/callback' && state['url'] != '/signup') {
      this.authService.browserCallBackURL = state.url;
    }
    let currentURL = state.url;
    let isLoggedIn2 = this.authService.isLoggedInObs();
    isLoggedIn2.subscribe((loggedin) => {
      if (loggedin) {
        let currentUser = JSON.parse(localStorage.getItem('Partner_currentUser'));
      }
      else {
        this.router.navigate(['/login']);
      }
      return true;
    });
    return isLoggedIn2;
  }

  isCheckLogin() {
    // check if the user is logged in
    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (!currentUser.userDetail.isAdmin) {
        return true;
      }
      return false;
    }

  }

  logout() {
    this.removeAllStorage();
  }

  removeAllStorage() {
    localStorage.clear();
  }

  public userFullName = new BehaviorSubject('');
  updateUserNameData = this.userFullName.asObservable();

  changeUserNameData(data: any) {
    this.userFullName.next(data);
  }
}
