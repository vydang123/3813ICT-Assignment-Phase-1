import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule],
      providers: [Router, UserService],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard on successful login', () => {
    spyOn(router, 'navigateByUrl');

    const mockResponse = {
      valid: true,
      user: {
        userid: 1,
        username: 'testuser',
        role: 'user',
        groupnames: ['group1'],
        channelnames: ['channel1'],
      },
    };

    spyOn(userService, 'loginfunc' as any).and.returnValue(of(mockResponse));

    component.userpwd = { email: 'test@gmail.com', pwd: 'testpassword' };
    component.loginfunc();

    expect(router.navigateByUrl).toHaveBeenCalledWith('dashboard');
  });

  it('should show an alert on invalid login', () => {
    spyOn(window, 'alert');

    const mockResponse = {
      valid: false,
    };

    spyOn(userService, 'loginfunc' as any).and.returnValue(of(mockResponse));

    component.userpwd = { email: 'invalid@gmail.com', pwd: 'invalidpassword' };
    component.loginfunc();

    expect(window.alert).toHaveBeenCalledWith('Sorry username or password is not valid');
  });

  it('should handle server error on login', () => {
    spyOn(window, 'alert');

    spyOn(userService, 'loginfunc' as any).and.returnValue(throwError('Server error'));

    component.userpwd = { email: 'test@gmail.com', pwd: 'testpassword' };
    component.loginfunc();

    expect(window.alert).toHaveBeenCalledWith('An error occurred during login.');
  });

  // Add more test cases to cover different scenarios

  afterEach(() => {
    httpTestingController.verify();
  });
});
