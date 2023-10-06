import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string = ''; // Initialize with empty string

  constructor(private router: Router) {}

  ngOnInit() {

    if (!sessionStorage.getItem('isLoggedin')) {
      this.router.navigate(['/login']);
    }

      const role = sessionStorage.getItem('role');
      if (role) {
          this.userRole = role;
      } else {
          // Handle cases where role is not found, perhaps redirect or show an error
          console.error("Role not found in session storage!");
      }
  }
}