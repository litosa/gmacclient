import { Favorite } from './favorite';
import { Coords } from './coords';

export class Employee {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    departmentId: string;
    isHiding: boolean;
    isInBuilding: boolean;
    favorites: Favorite[];
    coordinates: Coords;
    imageUrl: string;
    currentZoneId: string;
    currentRoomId: string;
}