import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Get the expected roles for the route
    const expectedRolesArray = route.data['expectedRoles'];

    // Fetch user details from session storage
    const sessionUser = sessionStorage.getItem('user');

    // If no sessionUser found, redirect to login
    if (!sessionUser) {
      this.router.navigateByUrl('/login');
      return false;
    }

    const userDetails = JSON.parse(sessionUser);

    // If user role matches any of the expected roles, proceed
    if (expectedRolesArray && expectedRolesArray.includes(userDetails.roles)) {
      return true;
    }

    // Otherwise, redirect to dashboard
    this.router.navigateByUrl('/dashboard');
    return false;
  }
}
