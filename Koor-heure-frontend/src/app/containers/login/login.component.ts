import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit {
  errorNewsletterAnimation: string = "invalid";
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  errorMessage: boolean = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    if (this.email.hasError('required') || this.password.hasError('required')) {
      this.errorNewsletterAnimation = 'valid';
      return
    }

    this.authService.login(this.email.value, this.password.value).subscribe((response) => {
      if (localStorage.getItem('access_token')) {
        localStorage.removeItem('access_token');
      }
      localStorage.setItem("access_token", JSON.parse(JSON.stringify(response)).access_token);
      this.router.navigate(['admin']);
    }, (error) => {
      this.errorMessage = true;
      this.errorNewsletterAnimation = 'valid';
    })
  }
  setBackToValid() {
    this.errorNewsletterAnimation = 'invalid';
  }
}
