import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import { Room } from '../models/room';
import { AuthService } from '../shared/auth/auth.service'
import { AppSettings } from '../shared/app-settings';

@Injectable()
export class RoomService {

  private url = `${AppSettings.apiUrl}/rooms`

  constructor(
    private authHttp: AuthHttp,
    private authService: AuthService) { }

  getRoomById(id: string): Promise<Room> {
    return this.authHttp
      .get(`${this.url}/${id}`)
      .toPromise()
      .then(response => response.json() as Room)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}