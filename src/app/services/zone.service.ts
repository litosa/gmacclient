import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import { Zone } from '../models/zone';
import { AuthService } from '../shared/auth/auth.service';
import { AppSettings } from '../shared/app-settings';

@Injectable()
export class ZoneService {

  private url = `${AppSettings.apiUrl}/api/zones`
  private socket: any;

  constructor(
    private authHttp: AuthHttp,
    private authService: AuthService) { }

  getZones(): Promise<Zone[]> {
    return this.authHttp
      .get(this.url)
      .toPromise()
      .then(response => response.json() as Zone[])
      .catch(this.handleError);
  }

  getZoneById(id: string): Promise<Zone> {
    return this.authHttp
      .get(`${this.url}/${id}`)
      .toPromise()
      .then(response => response.json() as Zone)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}