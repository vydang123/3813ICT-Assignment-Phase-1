import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};
import { NgForm } from '@angular/forms';
// import { Userpwd } from '../userpwd';
// import { Userobj } from '../userobj';
import { Router } from '@angular/router';
// import {USERPWDS} from '../mock-users';
const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  userpwd = { email: 'abc@gmail.com', pwd: '123' };

  constructor(private router: Router, private httpClient: HttpClient, private userService: UserService) {}

  ngOnInit() {}

  public loginfunc() {
    this.httpClient.post(BACKEND_URL + '/login', this.userpwd, httpOptions)
      .subscribe((data: any) => {
        console.log('Received response:', data);
        alert("Login Successfully!");
        if (data.valid == true) {
          sessionStorage.setItem('userid', data.user.userid);
          sessionStorage.setItem('username', data.user.username);
          sessionStorage.setItem('role', data.user.role); 
          sessionStorage.setItem('groupids', data.user.groupids);
          sessionStorage.setItem('isLoggedin', 'true'); 
          // Storing the entire user object in sessionStorage
          sessionStorage.setItem('user', JSON.stringify(data.user));
          this.router.navigateByUrl('dashboard');
        } else {
          console.log(data);
          alert('Sorry username or password is not valid');
        }
      });
  }
  
}