import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { Zone } from '../../models/zone';
import { ZoneService } from '../../services/zone.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';
import { AuthService } from '../../shared/auth/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';

// import { InitialsPipe } from '../../../shared/initials.pipe';

@Component({
  selector: 'zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {

  zones: Zone[];
  departments: Department[];
  selectedEmployee: Employee;

  constructor(
    private router: Router,
    private zoneService: ZoneService,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.zoneService.getZones()
      .then(zones => {
        this.zones = zones;
        zones.forEach(zone => {
          this.employeeService.getEmployees().then((employees) => {
            zone.employees = employees.filter(employee => employee.currentZone === zone.name);
          });
        });
      });
    this.departmentService.getDepartments().then((departments) => this.departments = departments);
  }

  setModalContent(selectedEmployee: Employee) {
    this.selectedEmployee = selectedEmployee;
  }
}