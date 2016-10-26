import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import { Department } from '../models/department';
import { AuthService } from '../shared/auth/auth.service';
import { AppSettings } from '../shared/app-settings';

@Injectable()
export class DepartmentService {

  private url = `${AppSettings.apiUrl}/departments`

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

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}