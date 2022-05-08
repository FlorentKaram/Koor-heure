import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDialogComponent } from 'src/app/dialogs/user-dialog/user-dialog.component';
import { UserForm } from 'src/app/forms/user.form';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import jwtDecode from 'jwt-decode'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [UserForm]
})
export class AdminComponent implements OnInit {
  userList!: UserModel[];
  constructor(private userService: UserService,private router: Router, public dialogUser: MatDialog, public userForm: UserForm) { }

  ngOnInit(): void {
    this.getUsers();
  }

  openUserDialog(user : UserModel) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.panelClass = 'mat-dialog';
    dialogConfig.data = this.userForm.createUserForm(user);;
    let dialogRef = this.dialogUser.open(UserDialogComponent,dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      let token = localStorage.getItem('access_token');
      if (token && JSON.parse(JSON.stringify(jwtDecode(token))).name == user.name) {
        localStorage.removeItem('access_token');
        this.router.navigate(['/']);
      }
      this.getUsers();
    })
  }
  
  getUsers() {
    this.userService.getUsers().subscribe((result) => {
      this.userList = JSON.parse(JSON.stringify(result));
    })
  }

  update(user: UserModel) {
    this.openUserDialog(user);
  }

  see(user: UserModel) {
    this.router.navigate(['/user',{email : user.email}]);
  }
  
  add(){
    this.openUserDialog({});
  }

  remove(user: UserModel) {
    this.userService.deleteUser(user.email!).subscribe(() => {
      this.getUsers();
    }, (error) => { 
      alert('You can`t delete yourself');
    })
  }
}
