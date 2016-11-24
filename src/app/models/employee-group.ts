import { Employee } from './employee';
import { Coords } from './coords';

export class EmployeeGroup {
    employees: Employee[] = [];

    constructor(
        public coords: Coords
    ) { }
}