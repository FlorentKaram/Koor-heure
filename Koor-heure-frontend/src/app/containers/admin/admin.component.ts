import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDialogComponent } from 'src/app/dialogs/user-dialog/user-dialog.component';
import { UserForm } from 'src/app/forms/user.form';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userList! : UserModel[];
  constructor(private userService: UserService,public dialogUser: MatDialog) {}

  ngOnInit(): void {
    this.getUsers();
  }
  
  openUserDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.panelClass = 'mat-dialog';
    let dialogRef = this.dialogUser.open(UserDialogComponent , dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.userService.createUser(result).subscribe(()=>{
        this.getUsers();
      })
    })
  }
  getUsers(){
    this.userService.getUsers().subscribe((result) => {
      this.userList = JSON.parse(JSON.stringify(result));
    })
  }

  update(user: UserModel){

  }

  see(user : UserModel){

  }
  remove(user : UserModel){
    this.userService.deleteUser(user.email!).subscribe(()=>{
      this.getUsers();
    })
  }
}
