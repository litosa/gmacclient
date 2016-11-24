import { Employee } from '../../models/employee';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'employee-map-item',
  templateUrl: './employee-map-item.component.html',
  styleUrls: ['./employee-map-item.component.css']
})
export class EmployeeMapItemComponent {

  @Input() employee: Employee
  @Input() departmentColor: string
  @Input() isSelected: boolean
  @Input() isFavorite: boolean
  @Output() onToggleSelect = new EventEmitter();

  toggleEmployeeDetails() {
    this.onToggleSelect.emit(this.employee._id);
  }
}