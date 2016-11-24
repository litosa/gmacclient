import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TooltipModule, CollapseModule, DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { routing, appRoutingProviders } from './app-routing.module';

import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

import { EmployeeService } from './services/employee.service';
import { ImageService } from './services/image.service';
import { ZoneService } from './services/zone.service';
import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard';
import { DepartmentService } from './services/department.service';

import { InitialsPipe } from './shared/initials.pipe';
import { LoadingComponent } from './shared/loading/loading.component';
import { MapComponent } from './components/map/map.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { SearchComponent } from './components/search/search.component';
import { EmployeeListItemComponent } from './components/employee-list-item/employee-list-item.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DetailsComponent } from './components/details/details.component';
import { EmployeeMapItemComponent } from './components/employee-map-item/employee-map-item.component';
import { DefaultImageDirective } from './directives/default-image.directive';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    InitialsPipe,
    NavbarComponent,
    PageNotFoundComponent,
    LoadingComponent,
    MapComponent,
    FavoritesComponent,
    SearchComponent,
    EmployeeListItemComponent,
    SettingsComponent,
    DetailsComponent,
    EmployeeMapItemComponent,
    DefaultImageDirective
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    TooltipModule,
    CollapseModule,
    DropdownModule,
    routing
  ],

  providers: [
    appRoutingProviders,
    EmployeeService,
    ZoneService,
    AuthService,
    DepartmentService,
    ImageService,
    AuthGuard,
    AUTH_PROVIDERS
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
