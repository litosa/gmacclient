import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Employee } from '../../models/employee';
import { Department } from '../../models/department';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl();
  searchResults: Employee[];
  departments: Department[];
  employees: Employee[];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService) { }

  ngOnInit() {
    this.searchControl
      .valueChanges
      .debounceTime(500)
      .subscribe(searchText => {
        this.search(searchText);
      });

    this.employeeService.getEmployees().then(employees => this.employees = employees);
    this.departmentService.getDepartments().then(departments => this.departments = departments);
  }

  search(searchText: string) {
    searchText ? this.searchResults = this.employees.filter(e =>
      (e.firstName && e.firstName.toLowerCase().includes(searchText.toLowerCase()))
      || (e.lastName && e.lastName.toLowerCase().includes(searchText.toLowerCase()))
      || (e.firstName && e.lastName && (e.firstName + ' ' + e.lastName).toLowerCase().includes(searchText.toLowerCase()))) : this.searchResults = [];
  }

  getDepartmentName(departmentId: string) {
    var department = this.departments.find(d => d._id === departmentId);
    if (department) {
      return department.name;
    }
    return 'Ej angivet';
  }
}