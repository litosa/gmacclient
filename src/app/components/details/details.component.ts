import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';
import { Favorite } from '../../models/favorite';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  subscription: Subscription;
  favoriteSubscription: Subscription;
  user: Employee;
  employee: Employee;
  departments: Department[];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService) { }

  ngOnInit() {
    this.departmentService.getDepartments().then(departments => this.departments = departments);

    this.subscription = this.employeeService.onEmployeeChange$.subscribe(employeeId => {
      if (this.employee && this.employee._id === employeeId) {
        this.employee = null;
      }
      else {
        this.employeeService.getEmployeeById(employeeId).then(employee => {
          this.employee = employee;
        });
      }
    });

    this.favoriteSubscription = this.employeeService.onFavoriteChange$.subscribe(employeeId => {
      if (this.employee && this.employee._id === employeeId) {
        // this.isFavorite = !this.isFavorite;
      }
    });
  }

  getDepartmentName(departmentId: string) {
    var department = this.departments.find(d => d._id === departmentId);
    if (department) {
      return department.name;
    }
    return 'Ej angivet';
  }

  close() {
    this.employeeService.toggleEmployeeDetails(this.employee._id);
    this.employee = null;
  }
}