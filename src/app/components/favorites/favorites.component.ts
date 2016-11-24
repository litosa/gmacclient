import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, Input } from '@angular/core';

import { Favorite } from '../../models/favorite';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  employees: Employee[];
  favoriteEmployees: Employee[];
  departments: Department[];
  favoriteSubscription: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService) { }

  ngOnInit() {

    this.favoriteSubscription = this.employeeService.onFavoriteChange$.subscribe(employeeId => {
      if (this.employeeService.isFavorite(employeeId)) {
        var employee = this.employees.find(e => e._id === employeeId);
        this.favoriteEmployees.push(employee);
      }
      else {
        this.favoriteEmployees = this.favoriteEmployees.filter(fe => fe._id !== employeeId);
      }
    });

    this.departmentService.getDepartments().then(departments => {
      this.departments = departments;
      this.employeeService.getEmployees().then((employees) => {
        this.employees = employees;
        this.favoriteEmployees = employees.filter(e => this.employeeService.getUser().favorites.find(f => f.employeeId === e._id));
      });
    });
  }

  getDepartmentName(departmentId: string) {
    var department = this.departments.find(d => d._id === departmentId);
    if (department) {
      return department.name;
    }
    return 'Ej angivet';
  }
}