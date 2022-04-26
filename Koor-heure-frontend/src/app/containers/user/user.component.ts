import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user! : UserModel;
  email : string;
  constructor(private router : Router,private route : ActivatedRoute,private userService: UserService) { 
    this.email = this.route.snapshot.paramMap.get('email')!;

  }

  ngOnInit(): void {
    this.getUser();
  }
  getUser(){
    this.userService.getUser(this.email).subscribe((result) => {
      this.user = JSON.parse(JSON.stringify(result));
    })
  }

}
