import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserForm } from 'src/app/forms/user.form';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  providers: [UserForm]
})
export class UserDialogComponent implements OnInit {
  newUser!: FormGroup;
  constructor(private dialogRef: MatDialogRef<UserDialogComponent>, private userForm: UserForm) {
    this.newUser = this.userForm.createUserForm({});
  }
  ngOnInit(): void {
  }

}
