import { Coords } from './coords';
import { Employee } from './employee';

export class EmployeeContainer {

    public employees: Employee[] = []

    constructor(
        public width: number,
        public height: number,
        public coordinates: Coords,
        public slots: number
    ) {}
}