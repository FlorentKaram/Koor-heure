import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserForm } from 'src/app/forms/user.form';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  providers: [UserForm],
  animations: [
    trigger('errorNewsletterAnimation', [
      state('invalid', style({})),
      state('valid', style({})),
      transition('invalid => valid', animate(200, keyframes([
        style({ transform: 'translateX(5px)' }),
        style({ transform: 'translateX(-5px)' }),
        style({ transform: 'translateX(5px)' }),
        style({ transform: 'translateX(-5px)' }),
      ])))
    ])
  ]
})
export class UserDialogComponent implements OnInit {
  oldEmail: string = "";
  updateUser: boolean = false;
  newUser!: FormGroup;
  emailAlreadyUse: boolean = false;
  confirmPassword = new FormControl('', Validators.required);
  equalityPass = true;
  errorNewsletterAnimation: string = "invalid";
  constructor(@Inject(MAT_DIALOG_DATA) public user: FormGroup, private dialogRef: MatDialogRef<UserDialogComponent>, private userForm: UserForm, private userService: UserService) {
    if (user.get('email')?.value != null) {
      this.oldEmail = user.get('email')?.value;
      this.newUser = user;
      this.updateUser = true;
      return
    }
    this.newUser = this.userForm.createUserForm({ admin: false });
  }
  ngOnInit(): void {
  }

  createUser() {
    this.checkEquality();
    if (this.newUser.get('name')?.hasError('required') ||
      this.newUser.get('email')?.hasError('required') ||
      this.newUser.get('password')?.hasError('required')) {
      return
    }
    this.userService.createUser(this.newUser.value).subscribe((result) => {
      this.dialogRef.close();
    }, (error) => {
      if (error.status == 201) {
        this.dialogRef.close();
      }
      else {
        if (this.emailAlreadyUse) {
          this.errorNewsletterAnimation = "valid";
        }
        this.emailAlreadyUse = true;
      }
    }
    );

  }
  checkEquality() {
    if (this.confirmPassword.value != this.newUser.get('password')?.value) {
      this.equalityPass = false
    }
    else {
      this.equalityPass = true
    }
  }

  validDialog() {
    this.checkEquality()
    if (this.newUser.get('email')!.hasError('required') ||
      this.newUser.get('password')!.hasError('required') ||
      this.newUser.get('name')!.hasError('required') ||
      this.confirmPassword.hasError('required') ||
      !this.equalityPass) {
      this.errorNewsletterAnimation = 'valid';
      return
    }
    this.checkEquality();
    if (!this.equalityPass) {
      return
    }
    this.createUser();
  }

  patchUser() {
    this.userService.patchUser(this.oldEmail, this.newUser.value).subscribe(()=>{
      this.dialogRef.close();
    })
  }

  setBackToValid() {
    this.errorNewsletterAnimation = 'invalid';
  }
}
