import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should register a user', () => {
    // Define the expected response for this test
    const mockResponse = { valid: true };

    // Define the user data
    const userData = { username: 'testuser', email: 'testuser@example.com', password: 'testpassword' };

    // Perform the user registration
    userService.registerUser(userData).subscribe((response) => {
      expect(response).toEqual(mockResponse); // Check if the response matches the expected response
    });

    // Expect an HTTP request
    const req = httpTestingController.expectOne((request) => {
      return request.url === `${userService['apiUrl']}/register`; // Access the private apiUrl property
    });

    expect(req.request.method).toBe('POST');
    
    // Respond with the mock response
    req.flush(mockResponse);

    // Verify that there are no outstanding requests
    httpTestingController.verify();
  });

  // ... other test cases ...
});
