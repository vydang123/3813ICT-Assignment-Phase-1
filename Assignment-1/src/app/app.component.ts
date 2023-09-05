import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'week4tut';

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  userList = [
    {email: 'lvmytran@gmail.com', password: '123'},
    {email: 'vydang@gmail.com', password: '345'},
    {email: 'lalisa@gmail.com', password: '567'}
  ];

  constructor(private router: Router){}

  login(){
    const matchingUser = this.userList.find(user => user.email === this.email && user.password === this.password);

    if (matchingUser){
      this.errorMessage = '';
      this.router.navigate(['/account']);
    } else {
      this.errorMessage = 'Invalid email or password.'
    }
  }
  logout() {
    // Clear session storage and redirect to login
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
