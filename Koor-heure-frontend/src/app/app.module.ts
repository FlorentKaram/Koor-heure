import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './containers/login/login.component';
import { AdminComponent } from './containers/admin/admin.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from './services/user.service';
import { AuthInterceptor } from './services/authInterceptor.service';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from './dialogs/user-dialog/user-dialog.component';
import { UserForm } from './forms/user.form';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    UserDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [
    AuthService, 
    UserService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
