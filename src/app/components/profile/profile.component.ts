import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {

  userId: string;
  profile: Employee;

  constructor(
    private location: Location,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.profile = JSON.parse(localStorage.getItem('profile'));
  }

  updateProfile() {
    console.log(this.profile);

    // this.employeeService.updateEmployee(this.userId, this.profile)
    //   .then(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
