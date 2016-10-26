import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public isCollapsed: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  logout() {
    // this.authService.logoutUser();
    // this.isCollapsed = true;
    // this.router.navigate(['/login'])
    this.authService.logout();
    this.router.navigate(['/home']);

  }

  isActive(path: string) {
    return this.router.isActive(path, true)
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;

    // if (!this.authService.loggedIn())
    // {
    //   this.router.navigate(['/login'])
    // }
  }
}