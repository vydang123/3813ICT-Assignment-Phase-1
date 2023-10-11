import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [Router],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard on successful login', () => {
    spyOn(router, 'navigate');
    component.email = 'lvmytran@gmail.com';
    component.password = '123';

    component.login();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.errorMessage).toBe('');
  });

  it('should show an error message on invalid login', () => {
    component.email = 'nonexistent@gmail.com';
    component.password = 'invalidpassword';

    component.login();

    expect(component.errorMessage).toBe('Invalid email or password.');
  });

  it('should clear session storage and navigate to login on logout', () => {
    spyOn(router, 'navigate');
    spyOn(sessionStorage, 'clear');
    
    component.logout();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(sessionStorage.clear).toHaveBeenCalled();
  });
});
