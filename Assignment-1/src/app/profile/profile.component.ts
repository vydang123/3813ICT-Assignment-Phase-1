import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {}; // Define the type of user object

  constructor() {}

  ngOnInit(): void {
    this.userProfile.username = sessionStorage.getItem("username");
    this.userProfile.groups = sessionStorage.getItem("groups");
    this.userProfile.userid = sessionStorage.getItem("userid");

  }
  saveChanges() {
    sessionStorage.setItem('username', this.userProfile.username);
    sessionStorage.setItem('groups', this.userProfile.groups)
    sessionStorage.setItem('userid', this.userProfile.userid)
  }
  
}

