import { EmployeeContainer } from '../../models/employee-container';
import { Zone } from '../../models/zone';
import { Room } from '../../models/room';
import { Coords } from '../../models/coords';
import { latinMap } from 'ng2-bootstrap/components/typeahead/latin-map';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Employee } from '../../models/employee';
import { EmployeeGroup } from '../../models/employee-group';
import { Department } from '../../models/department';
import { Favorite } from '../../models/favorite';

import { RoomService } from '../../services/room.service';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [RoomService],
})
export class MapComponent implements OnInit, OnDestroy {

    employees: Employee[];
    departments: Department[];
    connection: any;
    isBusy: boolean;
    filterSubscription: Subscription;
    favoriteSubscription: Subscription;
    favoritesOnlySubscription: Subscription;
    selectedEmployeeSubscription: Subscription;
    selectedEmployeeId: string;
    zones: Zone[];
    rooms: Room[];

    constructor(
        private roomService: RoomService,
        private departmentService: DepartmentService,
        private employeeService: EmployeeService) { }

    ngOnInit() {
        this.isBusy = true;
        this.createZones();

        this.selectedEmployeeSubscription = this.employeeService.onEmployeeChange$.subscribe(employeeId => {
            if (this.selectedEmployeeId === employeeId) {
                this.selectedEmployeeId = null;
            }
            else {
                this.selectedEmployeeId = employeeId;
            }
        });

        this.favoriteSubscription = this.employeeService.onFavoriteChange$.subscribe(employeeId => {
            if (this.employeeService.isFavorite(employeeId)) {
                if (this.employeeService.isShowingOnlyFavorites()) {
                    var employee = this.employees.find(e => e._id === employeeId);
                    this.addEmployeeToMap(employee);
                }
            }
            else {
                if (this.employeeService.isShowingOnlyFavorites()) {
                    var employee = this.employees.find(e => e._id === employeeId);
                    this.removeEmployeeFromMap(employee);
                }
            }
        });

        this.favoritesOnlySubscription = this.employeeService.onFavoritesOnlyChange$.subscribe(favoritesOnly => {
            if (favoritesOnly) {
                this.removeEmployeesFromMap();
            }
            else {
                this.addEmployeesToMap();
            }
        });

        this.filterSubscription = this.departmentService.onFilterChange$.subscribe(departmentId => {
            if (this.departmentService.isInDepartmentFilter(departmentId)) {
                this.addEmployeesToMap();
            }
            else {
                this.removeEmployeesFromMap();
            }
        });



        this.roomService.getRooms().then(rooms => {
            this.rooms = rooms;
            this.departmentService.getDepartments().then((departments) => {
                this.departments = departments;
                this.employeeService.getEmployees().then((employees) => {
                    this.employees = employees;
                    this.connection = this.employeeService.realTimeUpdateOnEmployees().subscribe((updatedEmployee: Employee) => {
                        var employee = this.employees.find(e => e._id === updatedEmployee._id);
                        if (!employee) {
                            this.employees.push(updatedEmployee);
                            if (this.ifMeetsTheRequirments(updatedEmployee)) {
                                this.addEmployeeToMap(updatedEmployee);
                            }
                        }
                        else {
                            if (this.ifMeetsTheRequirments(updatedEmployee)) {
                                if (this.ifNewPosition(employee, updatedEmployee)) {
                                    this.removeEmployeeFromMap(employee);
                                    this.addEmployeeToMap(updatedEmployee);
                                }
                            }
                            else {
                                this.removeEmployeeFromMap(employee);
                            }
                            this.updateEmployee(employee, updatedEmployee);
                        }
                    });
                    this.addEmployeesToMap();
                    // this.addALotOfEmployeesToTheMap();
                    this.isBusy = false;
                });
            });
        });
    }

    addALotOfEmployeesToTheMap() {
        var employeesToBeAdded = this.employees.filter(e => this.ifMeetsTheRequirments(e));
        for (var i = 0; i < 100; i++) {
            employeesToBeAdded.forEach(employee => {
                this.addEmployeeToMap(employee);
            });
        }
    }

    ifNewPosition(employee: Employee, updatedEmployee: Employee) {
        return employee.currentZoneId !== updatedEmployee.currentZoneId || employee.currentRoomId !== updatedEmployee.currentRoomId;
    }

    ifMeetsTheRequirments(employee: Employee) {
        return !employee.isHiding
            && this.departmentService.isInDepartmentFilter(employee.departmentId)
            && (!this.employeeService.isShowingOnlyFavorites()
                || (this.employeeService.isShowingOnlyFavorites() && this.employeeService.getUser().favorites.find(f => f.employeeId === employee._id)));
    }

    updateEmployee(employee: Employee, updatedEmployee: Employee) {
        employee.currentZoneId = updatedEmployee.currentZoneId;
        employee.currentRoomId = updatedEmployee.currentRoomId;
        employee.departmentId = updatedEmployee.departmentId;

        var mapEmployee = this.getEmployeeOnMap(employee);

        if (mapEmployee) {
            mapEmployee.departmentId = employee.departmentId;
        }
    }

    addEmployeesToMap() {
        var employeesToBeAdded = this.employees.filter(e => this.ifMeetsTheRequirments(e) && !this.getEmployeeOnMap(e));
        employeesToBeAdded.forEach(employee => {
            this.addEmployeeToMap(employee);
        });
    }

    addEmployeeToMap(employee: Employee) {
        if (employee.currentRoomId) {
            this.addEmployeeToRoom(employee);
        }
        else if (employee.currentZoneId) {
            this.addEmployeeToZone(employee);
        }
    }

    addEmployeeToRoom(employee: Employee) {
        var room = this.rooms.find(r => r._id === employee.currentRoomId);
        if (room) {
            room.employees.push(employee);
        }
    }

    addEmployeeToZone(employee: Employee) {
        var zone = this.zones.find(z => z._id === employee.currentZoneId);
        if (zone) {
            var employeeContainer = this.getEmployeeContainer(employee, zone);
            if (employeeContainer) {
                employeeContainer.employees.push(employee);
            }
        }
    }

    getEmployeeContainer(employee: Employee, zone: Zone): EmployeeContainer {
        var employeeContainer: EmployeeContainer;
        zone.employeeContainers.forEach((container, index) => {
            if (!employeeContainer && container.slots > container.employees.length) {
                employeeContainer = container;
            }
        });
        return employeeContainer;
    }

    removeEmployeesFromMap() {
        var employeesToBeRemoved = this.getEmployeesOnMap().filter(e => !this.ifMeetsTheRequirments(e));
        employeesToBeRemoved.forEach(employee => {
            this.removeEmployeeFromMap(employee);
        });
    }

    removeEmployeeFromMap(employee: Employee) {
        if (employee.currentRoomId) {
            this.removeEmployeeFromRoom(employee);
        }
        if (employee.currentZoneId) {
            this.removeEmployeeFromZone(employee);
        }
    }

    removeEmployeeFromRoom(employee: Employee) {
        var room = this.rooms.find(r => r._id === employee.currentRoomId);
        if (room) {
            room.employees = room.employees.filter(e => e._id !== employee._id)
        }
    }

    removeEmployeeFromZone(employee: Employee) {
        var zone = this.zones.find(z => z._id === employee.currentZoneId);
        if (zone) {
            var employeeContainer = zone.employeeContainers.find(ec => ec.employees.some(e => e._id === employee._id));
            if (employeeContainer) {
                employeeContainer.employees = employeeContainer.employees.filter(e => e._id !== employee._id);
            }
        }
    }

    getEmployeesOnMap(): Employee[] {
        var employees = [];
        this.zones.forEach(zone => {
            zone.employeeContainers.forEach(employeeContainer => {
                employees = employees.concat(employeeContainer.employees);
            });
        });
        this.rooms.forEach(room => {
            employees = employees.concat(room.employees);
        })
        return employees;
    }

    getEmployeeOnMap(employee: Employee) {
        var zone = this.zones.find(z => z._id === employee.currentZoneId);

        if (zone) {
            var employeeContainer = zone.employeeContainers.find(ec => ec.employees.some(e => e._id === employee._id));
            if (employeeContainer) {
                return employeeContainer.employees.find(e => e._id === employee._id);
            }
        }

        var room = this.rooms.find(r => r._id === employee.currentRoomId);
        if (room) {
            return room.employees.find(e => e._id === employee._id);
        }
    }

    roomContainsSelectedEmployee(room: Room) {
        return room.employees.find(e => e._id === this.selectedEmployeeId);
    }

    getDepartmentColor(departmentId: string) {
        return this.departments.find(d => d._id === departmentId).color;
    }

    toggleEmployeeDetails(employeeId: string) {
        this.employeeService.toggleEmployeeDetails(employeeId);
    }

    createZones() {
        this.zones = [
            new Zone('16901', 'Dynamics', 263, 337, new Coords(0, 0), new Coords(80, 141), [new EmployeeContainer(253, 144, new Coords(0, 0), 28), new EmployeeContainer(198, 72, new Coords(0, 144), 12), new EmployeeContainer(294, 117, new Coords(82, 216), 24)]),
            new Zone('11052', 'MyTeam', 490, 150, new Coords(263, 0), new Coords(202, 54), [new EmployeeContainer(495, 140, new Coords(0, 0), 60)]),
            new Zone('37149', 'Lounge', 265, 337, new Coords(751, 0), new Coords(85, 141), [new EmployeeContainer(168, 143, new Coords(0, 0), 20), new EmployeeContainer(233, 188, new Coords(33, 143), 35)]),
            new Zone('49664', 'Ekonomi', 338, 337, new Coords(0, 337), new Coords(122, 126), [new EmployeeContainer(330, 330, new Coords(0, 0), 100)]),
            new Zone('48048', 'Entré', 314, 637, new Coords(381, 150), new Coords(119, 167), [new EmployeeContainer(306, 629, new Coords(0, 0), 171)]),
            new Zone('63995', 'Sälj', 314, 342, new Coords(702, 337), new Coords(140, 131), [new EmployeeContainer(231, 220, new Coords(0, 0), 42), new EmployeeContainer(100, 100, new Coords(0, 220), 9), new EmployeeContainer(100, 100, new Coords(202, 220), 9)]),
            new Zone('33260', 'Maverick', 318, 230, new Coords(0, 674), new Coords(111, 116), [new EmployeeContainer(115, 100, new Coords(0, 0), 9), new EmployeeContainer(318, 130, new Coords(0, 100), 36)]),
            new Zone('32449', 'Rekrytering', 318, 225, new Coords(702, 679), new Coords(101, 116), [new EmployeeContainer(311, 165, new Coords(0, 0), 45), new EmployeeContainer(222, 100, new Coords(0, 165), 18)])];
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}