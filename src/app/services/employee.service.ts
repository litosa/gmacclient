import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import { Employee } from '../models/employee';
import { AuthService } from '../shared/auth/auth.service'
import { AppSettings } from '../shared/app-settings';

@Injectable()
export class EmployeeService {

  private url = `${AppSettings.apiUrl}/employees`

  constructor(private authHttp: AuthHttp) { }

  getEmployees(): Promise<Employee[]> {
    return this.authHttp
      .get(this.url)
      .toPromise()
      .then(response => response.json() as Employee[])
      .catch(this.handleError);
  }

  getEmployeeById(id: string): Promise<Employee> {
    return this.authHttp
      .get(`${this.url}/${id}`)
      .toPromise()
      .then(response => response.json() as Employee)
      .catch(this.handleError);
  }

  postEmployee(employee: Employee): Promise<Employee> {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    return this.authHttp
      .post(this.url, JSON.stringify(employee), { headers: headers })
      .toPromise()
      .then(() => employee)
      .catch(this.handleError);
  }

  updateEmployee(id: string, employee: Employee): Promise<Employee> {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    const url = `${this.url}/${id}`;
    return this.authHttp
      .put(url, JSON.stringify(employee), { headers: headers })
      .toPromise()
      .then(() => employee)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}