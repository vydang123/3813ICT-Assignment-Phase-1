import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let successResponse: any;
  let errorResponse: any;

  beforeEach(() => {
    successResponse = { valid: true };
    errorResponse = { valid: false };

    userService = jasmine.createSpyObj('UserService', ['registerUser']);
    userService.registerUser.and.returnValue(of(successResponse));

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [{ provide: UserService, useValue: userService }],
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit and display success message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Registration successful!');
  }));

  it('should call onSubmit and display registration failed message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(of(errorResponse));
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Registration failed.');
  }));

  it('should call onSubmit and display error message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(throwError('Server error'));
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('An error occurred during registration.');
  }));

  it('should handle invalid response from the server', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(of({ valid: false, message: 'Invalid data' }));
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Invalid data');
  }));

  it('should handle unexpected error response', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(of({ valid: false }));
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Registration failed.');
  }));

  it('should call onSubmit with empty user data and handle registration failure', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(of(errorResponse));
  
    component.onSubmit();
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Registration failed.');
  }));
  
  it('should handle an error during registration with an invalid server response', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(of({}));
  
    component.onSubmit();
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('An error occurred during registration.');
  }));
  
  it('should handle an error during registration with a custom error message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(throwError('Custom error message'));
  
    component.onSubmit();
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Custom error message');
  }));
  
});
