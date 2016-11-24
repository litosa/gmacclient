import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EmployeeService } from '../../services/employee.service';
import { ImageService } from '../../services/image.service';
import { Employee } from '../../models/employee';

import { AppSettings } from '../app-settings';

let Auth0Lock = require('auth0-lock').default;

@Injectable()
export class AuthService {

  lock = new Auth0Lock(AppSettings.clientId, AppSettings.authDomain, {
    closable: false,
    language: 'sv',
    theme: {
      logo: "../../../assets/img/gmac-logo.png",
      primaryColor: "#526e83"
    },
    languageDictionary: {
      title: "Get Me A Colleague"
    }
  });

  constructor(
    private employeeService: EmployeeService,
    private imageService: ImageService,
    private router: Router) {

    this.lock.on("authenticated", (authResult: any) => {

      localStorage.setItem('id_token', authResult.idToken);

      this.lock.getProfile(authResult.idToken, function (error: any, profile: any) {
        if (error) {
          throw new Error(error);
        }

        employeeService.getEmployeeById(profile.user_id).then((employee: Employee) => {
          if (employee == null) {

            employee = new Employee();
            employee._id = profile.user_id;
            employee.email = profile.email;

            var employeeUrl = employee.email.split('@')[0];

            while (employeeUrl.includes('.')) {
              employeeUrl = employeeUrl.replace('.', '_');
            }

            imageService.getImageById('sigma_employees').then(collection => {
              if (collection.sources.find(s => s === employeeUrl)) {
                employee.imageUrl = 'assets/img/employees/' + employeeUrl + '.jpg';
              }
              else {
                employee.imageUrl = 'assets/img/employees/default_user.jpg';
              }

              employeeService.postEmployee(employee).then((employee) => {
                localStorage.setItem('profile', JSON.stringify(employee));
                router.navigate(['/']);
              });
            })
          }
          else {
            localStorage.setItem('profile', JSON.stringify(employee));
            router.navigate(['/']);
          }
        });
      });
      this.lock.hide();
    });
  }

  public hasProfile() {
    if (localStorage.getItem('profile')) {
      return true;
    }
    return false;
  }

  public getProfile(): Employee {
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
    this.login();
  };
}