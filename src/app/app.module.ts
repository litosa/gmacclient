import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CollapseModule } from 'ng2-bootstrap/components/collapse';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { routing, appRoutingProviders } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ZonesComponent } from './components/zones/zones.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

import { EmployeeService } from './services/employee.service';
import { ZoneService } from './services/zone.service';
import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard';
import { DepartmentService } from './services/department.service';

import { InitialsPipe } from './shared/initials.pipe';
import { CollapseDirective } from './shared/collapse.directive';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ZonesComponent,
    InitialsPipe,
    CollapseDirective,
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent,  
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ModalModule,
    CollapseModule,
    routing
  ],

  providers: [
    appRoutingProviders,
    EmployeeService,
    ZoneService,
    AuthService,
    DepartmentService,
    AuthGuard,
    AUTH_PROVIDERS,
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
