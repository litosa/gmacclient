import { Component, OnInit } from '@angular/core';

import { Department } from '../../models/department';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  departments: Department[];

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.departmentService.getDepartments().then((departments) => this.departments = departments);
  }

  filterDepartments(departmentId: string) {
    this.departmentService.setDepartmentFilter(departmentId, this.departments);
  }

  toggleOnlyFavorites() {
    this.employeeService.toggleOnlyFavorites();
  }
}