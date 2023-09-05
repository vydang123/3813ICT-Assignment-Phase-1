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
    return this.http.get(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // User registration
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, this.httpOptions)
        .pipe(
            catchError(this.handleError)
        );
}

updateUser(userData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/updateUser`, userData, this.httpOptions)
      .pipe(catchError(this.handleError));
}

// Delete user
deleteUser(userData: any): Observable<any> {
  return this.http.delete(`${this.apiUrl}/deleteUser/${userData.userid}`, this.httpOptions)
      .pipe(catchError(this.handleError));
}

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
