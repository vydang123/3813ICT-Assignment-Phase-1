import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // Replace with your API endpoint

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // User registration
  registerUser(userData: any): Observable<any> {
    userData.role = ''; // Defaulting the role to 'user' on registration
    userData.groupid = []; // Default value for groups
    userData.valid = true; // Default value for validity
    
    return this.http.post(`${this.apiUrl}/register`, userData, this.httpOptions)
        .pipe(
            catchError(this.handleError)
        );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${userId}`, this.httpOptions)
        .pipe(
            catchError(this.handleError)
        );
}

updateUserRole(userId: number, newRole: string): Observable<any> {
  const data = {
      userId: userId,
      newRole: newRole
  };
  return this.http.put(`${this.apiUrl}/updateUserRole`, data, this.httpOptions)
      .pipe(
          catchError(this.handleError)
      );
}


// Error handling
private handleError(error: any) {
  console.error('An error occurred:', error);
  return throwError('Something went wrong; please try again later.');
}
}