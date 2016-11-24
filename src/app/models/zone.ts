import { EmployeeContainer } from './employee-container';
import { Coords } from './coords';
import { Employee } from './employee';

export class Zone {
    
    public employees: Employee[] = [];

    constructor(
        public _id: string,
        public name: string,
        public width: number,
        public height: number,
        public zoneCoordinates: Coords,
        public nameCoordinates: Coords,
        public employeeContainers: EmployeeContainer[]
    ) { }
}