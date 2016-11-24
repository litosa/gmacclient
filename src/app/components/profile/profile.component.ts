import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../shared/auth/auth.service';

import { Department } from '../../models/department';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  employee: Employee;
  departments: Department[];
  isBusy: boolean;
  isUpdating: boolean;
  @Output() onUpdate = new EventEmitter<boolean>();
  form: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.isBusy = true;
    this.departmentService.getDepartments().then((departments) => {
      this.departments = departments
      var userId = this.employeeService.getUser()._id;
      this.employeeService.getEmployeeById(userId).then(employee => {
        this.employee = employee;
        this.form = this.formBuilder.group({
          firstName: employee.firstName,
          lastName: employee.lastName,
          departmentId: employee.departmentId,
          isHiding: employee.isHiding
        });
        this.isBusy = false;
      });
    });
  }

  updateEmployee() {
    if (this.form.dirty) {
      this.isUpdating = true;
      var updEmployee: Employee = this.form.value;
      this.employee.firstName = updEmployee.firstName;
      this.employee.lastName = updEmployee.lastName;
      this.employee.departmentId = updEmployee.departmentId;
      this.employee.isHiding = updEmployee.isHiding;
      this.employeeService.updateUser(this.employee).then(() => {
        this.isUpdating = false;
        this.onUpdate.emit();
      });
    }
  }
}