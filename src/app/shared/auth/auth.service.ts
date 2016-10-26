import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

import { AppSettings } from '../app-settings';

let Auth0Lock = require('auth0-lock').default;

@Injectable()
export class AuthService {

  lock = new Auth0Lock(AppSettings.clientId, AppSettings.authDomain, {
    // closable: false,
    language: 'sv',
    // allowSignUp: false,
    // auth: {
    //   redirect: false
    // },
    // redirect: true,
    redirectUrl: `${AppSettings.clientUrl}/rooms`,
    theme: {
      logo: "../../../gmac-logo.png",
      primaryColor: "#204e99"
    },
    languageDictionary: {
      title: "Get Me A Colleague"
    }
  });

  private userName : string;

  constructor(
    private employeeService: EmployeeService,
    private router: Router) {

    this.lock.on("authenticated", (authResult: any) => {
      this.lock.getProfile(authResult.idToken, function (error: any, profile: any) {
        if (error) {
          throw new Error(error);
        }

        localStorage.setItem('id_token', authResult.idToken);

        employeeService.getEmployeeById(profile.user_id).then((employee: Employee) => {
          if (employee == null) {

            employee = new Employee();
            employee._id = profile.user_id;
            employee.username = profile.name;

            if (profile.name.includes(' ')) {
              var fullName = profile.name.split(' ');
              employee.firstName = fullName[0];
              employee.lastName = fullName[1];
            }

            else {
              employee.email = profile.name;
            }

            employeeService.postEmployee(employee).then(() => {
              localStorage.setItem('profile', JSON.stringify(employee));
            });
          }
          else {
            localStorage.setItem('profile', JSON.stringify(employee));
          }
        });
      });
    });
  }

  public hasProfile() {
    if (localStorage.getItem('profile')) {
      return true;
    }
    return false;
  }

  public getProfile() {
    return JSON.parse(localStorage.getItem('profile'));
  }

  public authenticated() {
    return tokenNotExpired();
  };

  public login() {
    this.lock.show();
  };

  public logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  };
}