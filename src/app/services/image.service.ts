import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import { AuthService } from '../shared/auth/auth.service'
import { AppSettings } from '../shared/app-settings';

@Injectable()
export class ImageService {

  private url = `${AppSettings.apiUrl}/api/images`

  constructor(
    private authHttp: AuthHttp) { }

  getImageById(id: string): Promise<any> {
    return this.authHttp
      .get(`${this.url}/${id}`)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}