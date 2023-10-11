import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SuperAdminComponent } from './super-admin.component';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('SuperAdminComponent', () => {
  let component: SuperAdminComponent;
  let fixture: ComponentFixture<SuperAdminComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let httpClient: jasmine.SpyObj<HttpClient>;
  let successResponse: any;
  let errorResponse: any;

  beforeEach(() => {
    successResponse = { valid: true, message: 'Success' };
    errorResponse = { valid: false, message: 'Error' };

    userService = jasmine.createSpyObj('UserService', [
      'registerUser',
      'updateUserRole',
      'deleteUser',
    ]);
    userService.registerUser.and.returnValue(of(successResponse));
    userService.updateUserRole.and.returnValue(of(successResponse));
    userService.deleteUser.and.returnValue(of(successResponse));

    httpClient = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      declarations: [SuperAdminComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: HttpClient, useValue: httpClient },
      ],
    });

    fixture = TestBed.createComponent(SuperAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit and display user added successfully message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('User added successfully.');
  }));

  it('should call onSubmit and display registration failed message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(of(errorResponse));
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Adding failed.');
  }));

  it('should call onSubmit and display unknown error message', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.registerUser.and.returnValue(throwError('Server error'));
    component.newUser = { username: 'testUser', email: 'test@example.com', password: 'password' };

    component.onSubmit();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('An unknown error occurred during the process.');
  }));

  it('should upgrade user to super admin', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    const user = { userid: 1, username: 'testUser', role: 'user' };

    component.upgradeToSuperAdmin(user);
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Success');
    expect(user.role).toBe('superadmin');
  }));

  it('should upgrade user to group admin', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    const user = { userid: 1, username: 'testUser', role: 'user' };

    component.upgradeToGroupAdmin(user);
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Success');
    expect(user.role).toBe('groupadmin');
  }));

  it('should degrade user to user', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    const user = { userid: 1, username: 'testUser', role: 'superadmin' };

    component.degradeToUser(user);
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Success');
    expect(user.role).toBe('user');
  }));

  it('should delete user and remove it from the local users array', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    const user = { userid: 1, username: 'testUser', email: 'test@example.com' };

    component.deleteUser(user);
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Success');
    expect(component.users.length).toBe(0);
  }));

  it('should delete user and handle an error', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    userService.deleteUser.and.returnValue(throwError('Server error'));
    const user = { userid: 1, username: 'testUser', email: 'test@example.com' };

    component.deleteUser(user);
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Error');
    expect(component.users.length).toBe(0);
  }));

  it('should fetch user groups and update the local users array', fakeAsync(() => {
    const response = { users: [{ username: 'user1' }, { username: 'user2' }] };
    httpClient.post.and.returnValue(of(response));

    component.fetchUserGroups();
    tick();

    expect(component.users.length).toBe(2);
    expect(component.users[0].username).toBe('user1');
    expect(component.users[1].username).toBe('user2');
  }));

  it('should handle an error when fetching user groups', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');
    httpClient.post.and.returnValue(throwError('Server error'));

    component.fetchUserGroups();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('Error fetching user groups: Server error');
  }));
});
