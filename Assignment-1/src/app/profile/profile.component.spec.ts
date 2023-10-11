import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['registerUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    });

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login when not logged in', () => {
    sessionStorage.removeItem('isLoggedin');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load user profile on init', () => {
    sessionStorage.setItem('isLoggedin', 'true');
    sessionStorage.setItem('username', 'testUser');
    sessionStorage.setItem('userid', '123');
    component.ngOnInit();

    expect(component.userProfile.username).toBe('testUser');
    expect(component.userProfile.userid).toBe('123');
  });

  it('should save changes to session storage', () => {
    component.userProfile.username = 'newName';
    component.userProfile.userid = '456';

    component.saveChanges();

    expect(sessionStorage.getItem('username')).toBe('newName');
    expect(sessionStorage.getItem('userid')).toBe('456');
  });

  it('should update UI on save changes', () => {
    const usernameInput = fixture.debugElement.query(By.css('input[formControlName="username"]')).nativeElement;

    // Set new username and trigger input event
    usernameInput.value = 'newName';
    usernameInput.dispatchEvent(new Event('input'));

    // Trigger saveChanges
    component.saveChanges();

    fixture.detectChanges();

    // Check if the updated username is displayed in the UI
    const updatedUsername = fixture.debugElement.query(By.css('.username-display')).nativeElement.textContent;
    expect(updatedUsername).toBe('newName');
  });
});
