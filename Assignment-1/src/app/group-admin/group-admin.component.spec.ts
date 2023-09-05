import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminComponent } from './group-admin.component';

describe('GroupAdminComponent', () => {
  let component: GroupAdminComponent;
  let fixture: ComponentFixture<GroupAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupAdminComponent]
    });
    fixture = TestBed.createComponent(GroupAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
