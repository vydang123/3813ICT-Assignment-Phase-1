import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
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

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit() {}

  public loginfunc() {
    this.httpClient.post(BACKEND_URL + '/login',this.userpwd, httpOptions)
      .subscribe((data: any) => {
        alert(JSON.stringify(this.userpwd));
        if (data.valid == true) {
          sessionStorage.setItem('userid', data.user.userid);
          sessionStorage.setItem('username', data.user.username);
          sessionStorage.setItem('roles', data.user.roles); // Adjust this based on your server response
          sessionStorage.setItem('groups', data.user.groups); // Adjust this based on your server response
            
          this.router.navigateByUrl('account');
        } else {
          console.log(data);
          alert('Sorry username or password is not valid');
        }
      });
  }
}