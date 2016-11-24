import { Injectable, OnInit } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/toPromise';

import { Department } from '../models/department';
import { AuthService } from '../shared/auth/auth.service';
import { AppSettings } from '../shared/app-settings';

@Injectable()
export class DepartmentService {

  private url = `${AppSettings.apiUrl}/api/departments`
  private departmentOnChangeSource = new Subject<string>();

  onFilterChange$ = this.departmentOnChangeSource.asObservable();

  constructor(
    private authHttp: AuthHttp,
    private authService: AuthService) { }

  getDepartments(): Promise<Department[]> {
    return this.authHttp
      .get(this.url)
      .toPromise()
      .then(response => response.json() as Department[])
      .catch(this.handleError);
  }

  getDepartmentById(id: string): Promise<Department> {
    return this.authHttp
      .get(`${this.url}/${id}`)
      .toPromise()
      .then(response => response.json() as Department)
      .catch(this.handleError);
  }

  setDepartmentFilter(departmentId: string, departments: Department[]) {
    var departmentFilter: string[] = JSON.parse(localStorage.getItem('department_filter'));
    if (!departmentFilter) {
      departmentFilter = [];
      departments.filter(d => d._id !== departmentId).forEach((department) => {
        departmentFilter.push(department._id);
      });
    }
    else {
      if (this.isInDepartmentFilter(departmentId)) {
        departmentFilter = departmentFilter.filter(id => id !== departmentId);
      }
      else {
        departmentFilter.push(departmentId);
      }
    }

    localStorage.setItem('department_filter', JSON.stringify(departmentFilter));
    this.departmentOnChangeSource.next(departmentId);
  }

  isInDepartmentFilter(departmentId: string): boolean {
    var departmentFilter: string[] = JSON.parse(localStorage.getItem('department_filter'));
    if (!departmentFilter || departmentFilter.find(id => id === departmentId)) {
      return true;
    }
    return false;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}