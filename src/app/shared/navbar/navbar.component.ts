import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '../../enums/action';
import { ActionLink } from '../../models/action-link';
import { Employee } from '../../models/employee';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  actionLinks: ActionLink[];
  activeActionLink: ActionLink;
  action = Action;
  
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router) { }

  ngOnInit() {
    this.actionLinks = [
      new ActionLink('Profil', Action.profile, 'fa-user'), 
      new ActionLink('Sök', Action.search, 'fa-search'), 
      new ActionLink('Filter', Action.settings, 'fa-cog'),
      new ActionLink('Favoriter', Action.favorites, 'fa-star')]
  }

  toggleOpen(actionLink: ActionLink) {
    if (this.activeActionLink !== actionLink) {
      this.activeActionLink = actionLink;
    }
    else {
      this.activeActionLink = null;
    }
  }

  closeAll() {
    this.actionLinks.forEach((a) => a.isOpen = false);
  }
}