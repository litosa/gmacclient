import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';

@Component({
  selector: 'app-employee-list-item',
  templateUrl: './employee-list-item.component.html',
  styleUrls: ['./employee-list-item.component.css']
})
export class EmployeeListItemComponent {

  @Input() employee: Employee;
  @Input() departmentName: string;
  @Output() onFavoriteToggled = new EventEmitter();
  @Input() isFavorite: boolean;

  constructor(private employeeService: EmployeeService) { }

  toggleEmployeeDetails() {
    this.employeeService.toggleEmployeeDetails(this.employee._id);
  }

  toggleFavorite() {
    this.onFavoriteToggled.emit(this.employee._id);
  }
}