import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [Router],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login when not logged in', () => {
    spyOn(router, 'navigate');
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    component.ngOnInit();

    expect(sessionStorage.getItem).toHaveBeenCalledWith('isLoggedin');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set userRole when role is found in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'isLoggedin') {
        return 'true';
      }
      if (key === 'role') {
        return 'user'; // Replace with the desired role
      }
      return null;
    });

    component.ngOnInit();

    expect(sessionStorage.getItem).toHaveBeenCalledWith('isLoggedin');
    expect(component.userRole).toEqual('user');
  });

  it('should handle cases where role is not found', () => {
    spyOn(console, 'error');
    spyOn(sessionStorage, 'getItem').and.returnValue('true');

    component.ngOnInit();

    expect(sessionStorage.getItem).toHaveBeenCalledWith('isLoggedin');
    expect(console.error).toHaveBeenCalledWith("Role not found in session storage!");
  });
});
