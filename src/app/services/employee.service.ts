import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

import { Employee } from '../models/employee';
import { Favorite } from '../models/favorite';
import { AppSettings } from '../shared/app-settings';
import { AuthService } from '../shared/auth/auth.service'

@Injectable()
export class EmployeeService {

  private employeeOnChangeSource = new Subject<string>();
  private favoriteOnChangeSource = new Subject<string>();
  private favoritesOnlyChangeSource = new Subject<boolean>();
  private url = `${AppSettings.apiUrl}/api/employees`
  private socket: any;

  onEmployeeChange$ = this.employeeOnChangeSource.asObservable();
  onFavoriteChange$ = this.favoriteOnChangeSource.asObservable();
  onFavoritesOnlyChange$ = this.favoritesOnlyChangeSource.asObservable();

  constructor(
    private authHttp: AuthHttp) { }

  realTimeUpdateOnEmployees() {
    let observable = new Observable((observer: any) => {
      this.socket = io(AppSettings.apiUrl);
      this.socket.on('update-employee', (employee: Employee) => {
        observer.next(employee);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  toggleEmployeeDetails(employeeId: string) {
    this.employeeOnChangeSource.next(employeeId);
  }

  // toggleFavorite(user: Employee, employeeId: string) {
  //   var favorites: Favorite[] = [];
  //   if (this.isFavorite(user, employeeId)) {
  //     favorites = user.favorites.filter(f => f.employeeId !== employeeId);
  //   }
  //   else {
  //     favorites = user.favorites;
  //     favorites.push(new Favorite(employeeId));
  //   }
  //   var updatedEmployee = new Employee();
  //   updatedEmployee.favorites = favorites;
  //   this.updateEmployee(user._id, updatedEmployee).then(() => this.favoriteOnChangeSource.next(employeeId));
  // }

  toggleFavorite(employeeId: string) {
    var user = this.getUser();
    if (this.isFavorite(employeeId)) {
      user.favorites = user.favorites.filter(f => f.employeeId !== employeeId);
    }
    else {
      user.favorites.push(new Favorite(employeeId));
    }
    this.updateUser(user).then(() => this.favoriteOnChangeSource.next(employeeId));
  }

  isFavorite(employeeId: string) {
    var user = this.getUser();
    return user.favorites.some(f => f.employeeId === employeeId);
  }

  toggleOnlyFavorites() {
    var favoritesOnly = JSON.parse(localStorage.getItem('favorites_only'))
    if (favoritesOnly === null) {
      favoritesOnly = true;
    }
    else {
      favoritesOnly = !favoritesOnly;
    }
    localStorage.setItem('favorites_only', JSON.stringify(favoritesOnly));
    this.favoritesOnlyChangeSource.next(favoritesOnly);
  }

  isShowingOnlyFavorites(): boolean {
    var favoritesOnly = JSON.parse(localStorage.getItem('favorites_only'))
    if (favoritesOnly === null) {
      favoritesOnly = false;
    }
    return favoritesOnly;
  }

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
      .then(response => response.json() as Employee)
      .catch(this.handleError);
  }

  updateEmployee(id: string, employee: Employee): Promise<Employee> {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    return this.authHttp
      .put(`${this.url}/${id}`, JSON.stringify(employee), { headers: headers })
      .toPromise()
      .then(() => employee)
      .catch(this.handleError);
  }

  getUser(): Employee {
    return JSON.parse(localStorage.getItem('profile'))
  }

  updateUser(user: Employee) {
    localStorage.setItem('profile', JSON.stringify(user));
    return this.updateEmployee(user._id, user);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}