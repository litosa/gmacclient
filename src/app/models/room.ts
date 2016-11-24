import { Employee } from './employee';
import { Coords } from './coords';

export class Room {

    public employees: Employee[] = [];
    public isExpanded: boolean;
    
    constructor(
        public _id: string,
        public name: string,
        public width: number,
        public height: number,
        public coordinates: Coords,
    ) { }
}