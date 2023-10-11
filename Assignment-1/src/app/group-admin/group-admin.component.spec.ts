import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GroupAdminComponent } from './group-admin.component';

describe('GroupAdminComponent', () => {
  let component: GroupAdminComponent;
  let fixture: ComponentFixture<GroupAdminComponent>;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupAdminComponent],
      imports: [HttpClientTestingModule],
      providers: [Router],
    });

    fixture = TestBed.createComponent(GroupAdminComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock sessionStorage for your tests
    spyOn(sessionStorage, 'getItem').and.returnValue('groupadmin');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users from the backend', fakeAsync(() => {
    const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
    const request = httpTestingController.expectOne('http://localhost:3000/getUsers');
    request.flush(mockUsers);

    component.ngOnInit();
    tick();

    expect(component.users).toEqual(mockUsers);
  }));

  it('should fetch groups from the backend', fakeAsync(() => {
    const mockGroups = [{ groupname: 'group1' }, { groupname: 'group2' }];
    const request = httpTestingController.expectOne('http://localhost:3000/getGroups');
    request.flush(mockGroups);

    component.ngOnInit();
    tick();

    expect(component.groups).toEqual(mockGroups);
  }));

  it('should add a new group', fakeAsync(() => {
    const newGroup = {
      groupid: 1,
      groupname: 'newGroup',
      channels: 0,
    };

    const mockResponse = { success: true };
    const request = httpTestingController.expectOne('http://localhost:3000/addGroup');
    request.flush(mockResponse);

    component.newGroup = newGroup;
    component.addGroup();
    tick();

    expect(component.groups).toContain(newGroup);
    expect(component.newGroup).toEqual({ groupid: null, groupname: '', channels: 0 });
  }));

  it('should add a user to a group', fakeAsync(() => {
    const username = 'testUser';
    const groupname = 'group1';
    const mockResponse = { success: true };
    const request = httpTestingController.expectOne('http://localhost:3000/addUserToGroup');
    request.flush(mockResponse);

    component.addUserToGroup(username, groupname);
    tick();

    expect(component.users[0].groupnames).toContain(groupname);
  }));

  it('should add a channel to a group', fakeAsync(() => {
    const newChannelName = 'newChannel';
    component.newChannelName = newChannelName;
    component.selectedGroupForChannel = { groupname: 'group1' };
  
    const mockResponse = { success: true };
    const request = httpTestingController.expectOne('http://localhost:3000/addChannel');
    request.flush(mockResponse);
  
    component.addChannelToGroup();
    tick();
  
    expect(component.channels).toContain(newChannelName);
  }));
  
  it('should remove a user from a group', fakeAsync(() => {
    component.selectedGroup = 'group1';
    component.selectedUser = 'user1';
  
    const mockResponse = { success: true };
    const request = httpTestingController.expectOne('http://localhost:3000/removeUserFromGroup');
    request.flush(mockResponse);
  
    component.removeUserFromGroup();
    tick();
  
    expect(component.users[0].groupnames).not.toContain(component.selectedGroup);
  }));
  
  it('should delete a channel from a group', fakeAsync(() => {
    const channelName = 'channel1';
    const group = { groupid: 1 };
    const mockResponse = { success: true };
    const request = httpTestingController.expectOne(`http://localhost:3000/deleteChannelFromGroup/${channelName}/${group.groupid}`);
    request.flush(mockResponse);
  
    component.deleteChannelFromGroup(channelName, group);
    tick();
  
    expect(component.channels).not.toContain(channelName);
  }));
  
  it('should filter available groups based on user\'s groupnames', () => {
    const username = 'user1';
    component.users = [
      { username: 'user1', groupnames: ['group1', 'group2'] },
      { username: 'user2', groupnames: ['group2', 'group3'] },
    ];
  
    component.filterGroups(username);
  
    expect(component.groups).toEqual([{ groupname: 'group1' }, { groupname: 'group2' }]);
  });
  
  it('should filter available channels based on selected group', () => {
    const groupname = 'group1';
    component.groups = [
      { groupname: 'group1', channels: ['channel1', 'channel2'] },
      { groupname: 'group2', channels: ['channel2', 'channel3'] },
    ];
  
    component.filterChannels(groupname);
  
    expect(component.channels).toEqual(['channel1', 'channel2']);
  });
  
  it('should add a user to a channel within a group', fakeAsync(() => {
    const username = 'user1';
    const groupname = 'group1';
    const channelname = 'channel1';
  
    const mockResponse = { success: true };
    const request = httpTestingController.expectOne('http://localhost:3000/addUserToChannel');
    request.flush(mockResponse);
  
    component.addUserToChannel(username, groupname, channelname);
    tick();
  
    // Add assertions as per your application logic
  }));
  
  it('should handle the case when no user is selected for adding to a group', () => {
    const alertSpy = spyOn(window, 'alert');
    component.selectedUser = null;
    component.selectedGroup = 'group1';
  
    component.addUserToGroup(null, component.selectedGroup);
  
    expect(alertSpy).toHaveBeenCalledWith('Please select a user and a group to add.');
  });
  
  it('should handle the case when no group is selected for adding a channel', () => {
    const alertSpy = spyOn(window, 'alert');
    component.newChannelName = 'newChannelName';
    component.selectedGroupForChannel = null;
  
    component.addChannelToGroup();
  
    expect(alertSpy).toHaveBeenCalledWith('Please select a group to add the channel.');
  });
  
  it('should handle the case when a group is not selected for adding a user', () => {
    const alertSpy = spyOn(window, 'alert');
    component.selectedGroup = null;
    component.selectedUser = 'user1';
  
    component.addUserToGroup('user1', null);
  
    expect(alertSpy).toHaveBeenCalledWith('Please select a user and a group to add.');
  });
  
  it('should handle the case when a group is not selected for removing a user', () => {
    const alertSpy = spyOn(window, 'alert');
    component.selectedGroup = null;
    component.selectedUser = 'user1';
  
    component.removeUserFromGroup();
  
    expect(alertSpy).toHaveBeenCalledWith('Please select a group and a user to remove.');
  });
  
  it('should handle the case when no group is selected for deleting a channel', () => {
    const alertSpy = spyOn(window, 'alert');
    const channelName = 'channel1';
    component.selectedGroup = null;
  
    component.deleteChannelFromGroup(channelName, { groupid: 1 });
  
    expect(alertSpy).toHaveBeenCalledWith('Please select a group to delete a channel from.');
  });
  
  it('should handle the case when the group name is not found for deleting a group', () => {
    const alertSpy = spyOn(window, 'alert');
    component.selectedGroup = null;
  
    component.deleteGroup(null);
  
    expect(alertSpy).toHaveBeenCalledWith('Please select a group to delete.');
  });
  
  it('should handle an error when adding a new group fails', fakeAsync(() => {
    const newGroup = {
      groupid: 1,
      groupname: 'newGroup',
      channels: 0,
    };
    const mockResponse = { success: false };
    const request = httpTestingController.expectOne('http://localhost:3000/addGroup');
    request.flush(mockResponse);
  
    const alertSpy = spyOn(window, 'alert');
  
    component.newGroup = newGroup;
    component.addGroup();
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Error adding the group.');
    expect(component.groups).not.toContain(newGroup);
  }));
  
  it('should handle an error when adding a user to a group fails', fakeAsync(() => {
    const username = 'testUser';
    const groupname = 'group1';
    const mockResponse = { success: false };
    const request = httpTestingController.expectOne('http://localhost:3000/addUserToGroup');
    request.flush(mockResponse);
  
    const alertSpy = spyOn(window, 'alert');
  
    component.addUserToGroup(username, groupname);
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Failed to add user to the group.');
    expect(component.users[0].groupnames).not.toContain(groupname);
  }));
  
  it('should handle an error when adding a channel to a group fails', fakeAsync(() => {
    const newChannelName = 'newChannel';
    component.newChannelName = newChannelName;
    component.selectedGroupForChannel = { groupname: 'group1' };
  
    const mockResponse = { success: false };
    const request = httpTestingController.expectOne('http://localhost:3000/addChannel');
    request.flush(mockResponse);
  
    const alertSpy = spyOn(window, 'alert');
  
    component.addChannelToGroup();
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Error adding the channel.');
    expect(component.channels).not.toContain(newChannelName);
  }));
  
  it('should handle an error when removing a user from a group fails', fakeAsync(() => {
    component.selectedGroup = 'group1';
    component.selectedUser = 'user1';
  
    const mockResponse = { success: false };
    const request = httpTestingController.expectOne('http://localhost:3000/removeUserFromGroup');
    request.flush(mockResponse);
  
    const alertSpy = spyOn(window, 'alert');
  
    component.removeUserFromGroup();
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Failed to remove user from the group:');
    expect(component.users[0].groupnames).toContain(component.selectedGroup);
  }));
  
  it('should handle an error when deleting a channel from a group fails', fakeAsync(() => {
    const channelName = 'channel1';
    const group = { groupid: 1 };
    const mockResponse = { success: false };
    const request = httpTestingController.expectOne(`http://localhost:3000/deleteChannelFromGroup/${channelName}/${group.groupid}`);
    request.flush(mockResponse);
  
    const alertSpy = spyOn(window, 'alert');
  
    component.deleteChannelFromGroup(channelName, group);
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('Error removing the channel from the group.');
    expect(component.channels).toContain(channelName);
  }));
  
  it('should handle an error when deleting a group fails', fakeAsync(() => {
    const group = { groupname: 'group1' };
    const mockResponse = { success: false };
    const request = httpTestingController.expectOne(`http://localhost:3000/api/deleteGroup/${group.groupname}`);
    request.flush(mockResponse);
  
    const alertSpy = spyOn(window, 'alert');
  
    component.deleteGroup(group);
    tick();
  
    expect(alertSpy).toHaveBeenCalledWith('An error occurred while deleting the group.');
    expect(component.groups).toContain(group);
  }));
  
  // You can add more test cases for other component methods like addChannelToGroup, removeUserFromGroup, etc.
});
