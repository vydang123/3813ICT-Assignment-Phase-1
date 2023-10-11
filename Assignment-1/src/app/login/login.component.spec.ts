import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule],
      providers: [Router, UserService],
    });

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard on successful login', () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

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

    expect(navigateByUrlSpy).toHaveBeenCalledWith('dashboard');
  });

  it('should show an alert on invalid login', () => {
    const alertSpy = spyOn(window, 'alert');

    const mockResponse = {
      valid: false,
    };

    spyOn(userService, 'loginfunc' as any).and.returnValue(of(mockResponse));

    component.userpwd = { email: 'invalid@gmail.com', pwd: 'invalidpassword' };
    component.loginfunc();

    expect(alertSpy).toHaveBeenCalledWith('Sorry, the username or password is not valid');
  });

  it('should handle server error on login', () => {
    const alertSpy = spyOn(window, 'alert');

    spyOn(userService, 'loginfunc' as any).and.returnValue(throwError('Server error'));

    component.userpwd = { email: 'test@gmail.com', pwd: 'testpassword' };
    component.loginfunc();

    expect(alertSpy).toHaveBeenCalledWith('An error occurred during login.');
  });

  it('should store user information in session storage on successful login', () => {
    const sessionStorageSetItemSpy = spyOn(sessionStorage, 'setItem');

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

    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('userid', '1');
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('username', 'testuser');
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('role', 'user');
    // Add more expectations for other sessionStorage items
  });

  // Add more test cases to cover different scenarios

  afterEach(() => {
    httpTestingController.verify();
  });
});
