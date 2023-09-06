# 3813ICT Assignment Phase 1

# GIT
## Layout of a Typical Git Repository:
* 	.git/: This is the directory where Git stores the metadata and object database for your project. This is the most important part of a Git repository and copying this folder elsewhere will clone the repository with its full history.
* 	Working Directory: The primary area where I'll be making changes to your code. This is the "current snapshot" of my project.
* 	Index: Also known as the staging area, this is an intermediate area where changes are collected before being permanently stored in the repository history.
* 	HEAD: This points to the latest commit in the branch that I've checked out.

## Approach for Version Control Using Git:
* 	Initialization: Using git clone to copy an existing repository.
* 	Add Changes: Make changes in my working directory.
* 	Stage Changes: Use git add . to stage all the changes in the current directory and its subdirectories for the next commit.
* 	Commit Changes: Use git commit -m "Description of changes" to permanently store staged changes in the repository history.
* 	Push/Pull: Use git push to upload local repository content to a remote repository and git pull to download content from a remote repository and integrate it into the local one.

# Data Structure

## users.json
Main Data Structures:
* 	Array of User Objects: Each object in this array represents a user in the system.
Attributes of a User Object:
* 	username: A string representing the username of the user.
* 	userid: An integer representing the unique ID of the user.
* 	role: A string representing the role of the user. Examples include groupadmin, superadmin, and user.
* 	groupids: An array of integers representing the IDs of the groups the user is associated with. In some user objects, there seems to be a slight inconsistency where the key is named groups instead of groupids (and the value is an integer instead of an array). This might be an error in the dataset.
* 	email: A string representing the user's email address.
* 	password: A string representing the user's password (usually, passwords shouldn't be stored in plain text for security reasons).
* 	valid: A boolean indicating whether the user's account is valid or not.

## group-channel.json
Main Data Structures:
* 	Array of Group-Channel Objects: Each object in this array represents a group with its associated channels.
Attributes of a Group-Channel Object:
* 	groupid: An integer representing the unique ID of the group.
* 	groupname: A string representing the name of the group.
* 	channels: An array of strings representing the names of channels associated with the group. There seems to be a slight inconsistency where, for some groups, the channels key has an integer value of 0 instead of an array. This might indicate that the group has no channels, but to maintain consistency, it would be better to use an empty array.
* 	members: An array of integers representing the user IDs of members associated with the group.

# REST API
server.js: 

* app.post('/login', require('./routes/postLogin'));
* app.post('/register',require('./routes/postRegister'));
* app.delete('/deleteUser/:userId', require('./routes/deleteUser'));
* app.put('/updateUserRole', require('./routes/updateUserRole'));
* app.get('/users', require('./routes/getUsers'));
* app.get('/groups', require('./routes/getGroups'));
* app.put('/addUserToGroup', require('./routes/addUserToGroup'));
* app.post('/addGroup', require('./routes/addGroup'));
* app.post('/addChannel', require('./routes/addChannel'));
* app.delete('/deleteChannelFromGroup/:channelId/:groupId', require('./routes/* deleteChannelFromGroup'));
* app.delete('/deleteGroup/:groupId', require('./routes/deleteGroup'));
* app.delete('/removeUser/:userId/:groupId', require('./routes/removeUser'));
* app.post('/login', require('./routes/postLogin'));


## app.post('/login', require('./routes/postLogin'));
/login - Authenticate a user
* 	HTTP Method: POST
* 	Endpoint: /login
* 	Handler: postLogin.js
Parameters:
Request Body:
* 	email: The email of the user attempting to log in.
* 	pwd: The password provided by the user.

Return Values:
* 	On success (i.e., email and password match an existing user):
     *	valid: true
     *	user:
     *	userid: The user's unique identifier.
     *	username: The name of the user.
     *	role: The role assigned to the user (e.g., 'groupadmin', 'superadmin', 'user').
     *	groupids: An array containing the IDs of groups the user belongs to.
     *	email: The email of the user.
* 	On failure (i.e., the provided email and password don't match any existing user):
     *	valid: false
Purpose:
* 	The purpose of this route is to authenticate users based on the provided email and password.
* 	When a POST request is made to this endpoint, the server will read from the users.json file to check if there's a user with the provided email and password.
* 	If such a user is found, the server sends back a response with valid set to true and includes the user's details. If not, the server sends a response with valid set to false.

How it works:
* 	The postLogin.js module is imported and used as a handler for the /login route in the server.js file.
* 	Within postLogin.js, the email and password are extracted from the request body using req.body.email and req.body.pwd, respectively.
* 	The module then attempts to read the users.json file.
* 	If an error occurs during the read operation, it throws an error.
* 	If the file is read successfully, the data is parsed into a JSON array.
* 	The array is searched to find a user with a matching email and password using the find() method.
* 	If a matching user is found, a response is sent with valid set to true and the user's details. If no match is found, a response with valid set to false is sent.

## app.post('/register',require('./routes/postRegister'));
/register - Register a new user or list existing users
* 	HTTP Method: POST
* 	Endpoint: /register
* 	Handler: postRegister.js
Parameters:
* 	Request Body:
     *	General user data including but not limited to:
       *	email: The email of the user being registered.
       *	username: The username of the user being registered.
       *	action: An optional action parameter that can have a value of "listUser". If this action is provided, the route will list all users.
     *	Other attributes can be added depending on the user registration fields you have. These might include password, firstName, lastName, etc.

Return Values:
* 	If the action "listUser" is provided:
     *	users: An array containing all registered users.
* 	On successful registration:
     *	valid: true
* 	On failure (e.g., email already exists, error reading users, error writing to file):
     *	valid: false
     *	message: A descriptive error message indicating the reason for failure, such as 'Email already in use.' or 'Error writing to file.'

Purpose:
* 	The primary purpose of this route is to register a new user.
* 	However, if the "listUser" action is provided in the request, the route will instead list all registered users.

How it works:
* 	The postRegister.js module is imported and used as a handler for the /register route in the server.js file.
* 	Within postRegister.js, all user data is extracted from the request body using req.body.
* 	The module uses the readusers() function to attempt to r*ad and parse the users.json file, which contains the data of all registered users.
* 	If there's an error reading the users, a 500 server error response is sent back.
* 	If the action provided is "listUser", it sends back a list of all users.
* 	If the action is not "listUser", the module checks if the provided email or username is already in use by another registered user.
* 	If either the email or username is already in use, a 400 error response is sent back.
* 	If the email and username are unique, a new userid is generated for the new user, and the new user data is added to the users array.
* 	The updated users array is then written back to the users.json file.
* 	If there's an error during the write operation, a 500 server error response is sent back. If the write operation is successful, a response indicating a successful registration (valid: true) is sent back.


## app.delete('/deleteUser/:userId', require('./routes/deleteUser'));
/deleteUser/:userId - Delete a user by userId
*	HTTP Method: DELETE
*	Endpoint: /deleteUser/:userId
*	Handler: deleteUser.js
Parameters:
*	URL Parameter:
    *	userId: The unique identifier of the user that needs to be deleted.
*	Return Values:

*	On successful deletion:
    *	message: "User deleted successfully."
*	On error reading the file:
    *	message: "Error reading the file."
*	On error writing to the file:
    *	message: "Error writing to the file."
Purpose:
*	The purpose of this route is to delete a user with a specific userId.
*	When a DELETE request is made to this endpoint, the server will read from the users.json file and check if there's a user with the provided userId.
*	If such a user is found, it is removed from the list and the updated list is written back to the users.json file. A successful response is then sent.
*	If any errors are encountered during reading or writing operations, appropriate error messages are sent in the response.

How it works:
*	The deleteUser.js module is imported and used as a handler for the /deleteUser/:userId route in the server.js file.
*	Within deleteUser.js, the userId is extracted from the URL parameters using req.params.userId.
*	The module then attempts to read the users.json file.
*	If an error occurs during the read operation, a response with an error message "Error reading the file." is sent.
*	If the file is read successfully, the data is parsed into a JSON array.
*	The array is filtered to exclude the user with the provided userId using the filter() method.
*	The updated user list is then written back to the users.json file.
*	If an error occurs during the write operation, a response with an error message "Error writing to the file." is sent.
*	If no errors occur during the entire process, a response with the message "User deleted successfully." is sent.

## app.put('/updateUserRole', require('./routes/updateUserRole'));
/updateUserRole - Update the role of a user
*	HTTP Method: PUT
*	Endpoint: /updateUserRole
*	Handler: updateUserRole.js

Parameters:
*	Request Body:
    *	userId: The unique identifier of the user whose role needs to be updated.
   	*	newRole: The new role that should be assigned to the user.
Return Values:

*	On successful role update:
    *	message: "User role updated successfully."
*	On error reading the file:
    *	message: "Error reading the file."
*	On error writing to the file:
    *	message: "Error writing to the file."
*	If the user is not found:
    *	message: "User not found."
Purpose:

*	The purpose of this route is to update the role of a user with a specific userId.
*	When a PUT request is made to this endpoint, the server will read from the users.json file, find the user with the provided userId, and update their role.
*	If the user is found and the role is updated successfully, the updated list is written back to the users.json file and a success message is sent in the response.
*	If any errors are encountered during reading, writing, or if the user is not found, appropriate error messages are sent in the response.

How it works:
*	The updateUserRole.js module is imported and used as a handler for the /updateUserRole route in the server.js file.
*	Within updateUserRole.js, the userId and newRole are extracted from the request body.
*	The module then attempts to read the users.json file.
*	If an error occurs during the read operation, a response with an error message "Error reading the file." is sent.
*	If the file is read successfully, the data is parsed into a JSON array.
*	The array is searched to find a user with the provided userId using the find() method.
*	If a user with the given userId is found, their role is updated to the value of newRole.
*	The updated user list is then written back to the users.json file.
*	If an error occurs during the write operation, a response with an error message "Error writing to the file." is sent.
*	If no user with the provided userId is found, a response with the message "User not found." is sent.
*	If no errors occur during the entire process and the user's role is updated, a response with the message "User role updated successfully." is sent.

## app.get('/users', require('./routes/getUsers'));
/users - Retrieve the list of all users

*	HTTP Method: GET
*	Endpoint: /users
*	Handler: getUsers.js

Parameters:
No parameters required in the request body.

Return Values:
*	On successful retrieval of user data:
    * A JSON array containing details of all users.
*	On error reading the file:
    * message: "Error reading the file."

Purpose:
*	The primary purpose of this route is to fetch and provide a list of all users.
*	When a GET request is made to this endpoint, the server will read from the users.json file and send the user data in the response.
*	If there's an error reading the file, a response with an appropriate error message is sent.

How it works:
*	The getUsers.js module is imported and used as a handler for the /users route in the server.js file.
*	Within getUsers.js, the module attempts to read the users.json file.
*	If an error occurs during the read operation, a response with the error message "Error reading the file." is sent.
*	If the file is read successfully, the data is parsed into a JSON array and sent as the response.


## app.get('/groups', require('./routes/getGroups'));
/groups - Retrieve the list of all groups and their associated channels
*	HTTP Method: GET
*	Endpoint: /groups
*	Handler: getGroups.js
Parameters:
*	No parameters required in the request body.
Return Values:
*	On successful retrieval of group data:
    * A JSON array containing details of all groups and their associated channels.
	On error reading the file:
    * message: "Error reading the file."

Purpose:
*	The primary purpose of this route is to fetch and provide a list of all groups and their channels.
*	When a GET request is made to this endpoint, the server will read from the group-channel.json file and send the group data in the response.
*	If there's an error reading the file, a response with an appropriate error message is sent.

How it works:
*	The getGroups.js module is imported and used as a handler for the /groups route in the server.js file.
*	Within getGroups.js, the module attempts to read the group-channel.json file.
*	If an error occurs during the read operation, a response with the error message "Error reading the file." is sent.
*	If the file is read successfully, the data is parsed into a JSON array and sent as the response.


## app.put('/addUserToGroup', require('./routes/addUserToGroup'));
/addUserToGroup - Add a user to a specified group
*	HTTP Method: PUT
*	Endpoint: /addUserToGroup
*	Handler: addUserToGroup.js
Parameters:
*	Request Body:
    *	userId: The ID of the user that needs to be added to the group. This value should be a number or a string that can be converted to a number.
    *	groupId: The ID of the group to which the user will be added. This value should be a number or a string that can be converted to a number.

Return Values:
*	On successful addition of the user to the group:
    *	success: true
    *	message: "User added to group."
*	On invalid or missing parameters:
    *	success: false
    *	message: "userId and groupId are required."
*	On server errors (e.g., reading or writing to the file):
    *	success: false
    *	message: "Server error."
    *	If the specified group is not found:
    *	success: false
    *	message: "Group not found."

Purpose:
*	The purpose of this route is to add a specific user to a particular group.
*	When a PUT request is made to this endpoint, the server attempts to update both the group-channel.json and users.json files to reflect the user's membership in the group.
*	Error messages are returned if there are any issues, such as missing parameters or server errors during file reading/writing.

How it works:
*	The addUserToGroup.js module is imported and used as a handler for the /addUserToGroup route in the server.js file.
*	Within addUserToGroup.js, the userId and groupId are extracted from the request body and converted to numbers.
*	The server reads the group-channel.json file to determine if the group exists.
*	If the group exists, the user's ID is added to the group's list of members.
*	The server then reads the users.json file to determine if the user exists.
*	If the user exists, the group's ID is added to the user's list of groups.
*	Finally, the updated data is written back to both files (group-channel.json and users.json).
*	Appropriate response messages are sent based on the outcome of each operation.


## app.post('/addGroup', require('./routes/addGroup'));
/addGroup - Add a new group
*	HTTP Method: POST
*	Endpoint: /addGroup
*	Handler: addGroup.js

Parameters:
*	Request Body:
    *	The request body should contain the group details you want to add. The exact structure depends on the schema you've defined for a group in group-channel.json. Typically, this could include fields like groupid, groupName, members, etc.

Return Values:

*	On successful addition of the group:
    *	success: true
    *	message: "Group added successfully."
*	On server errors (e.g., reading or writing to the file):
    *	message: "Error reading the file." or "Error writing to the file."

Purpose:
*	The purpose of this route is to allow clients to add a new group to the existing list of groups.
*	When a POST request is made to this endpoint, the server will read from the group-channel.json file, add the new group details provided in the request body to the existing list, and then write the updated list back to the file.
*	Responses indicating success or failure of the operation will be sent back to the client based on the outcome.

How it works:
*	The addGroup.js module is imported and used as a handler for the /addGroup route in the server.js file.
*	Inside addGroup.js, the server first reads the group-channel.json file to fetch the current list of groups.
*	The new group details, sent in the request body, are added to this list.
*	The updated list is then written back to the group-channel.json file.
*	The server sends an appropriate response based on whether the write operation was successful or if there was an error at any point in the process.


## app.post('/addChannel', require('./routes/addChannel'));
/addChannel - Add a new channel to an existing group
*	HTTP Method: POST
*	Endpoint: /addChannel
*	Handler: addChannel.js

Parameters:
*	Request Body:
    *	groupName: The name of the channel you want to add.
    *	groupId: The unique identifier of the group to which the channel should be added.

Return Values:
*	On successful addition of the channel to the group:
    *	success: true
    *	message: "Channel added to group."
*	On errors (e.g., missing parameters, group not found, server error during reading or writing to the file):
    *	success: false
    *	message: A corresponding error message like "groupName and groupId are required." or "Group not found." or "Server error."

Purpose:
*	The purpose of this route is to allow clients to add a new channel to an existing group.
*	When a POST request is made to this endpoint, the server will read from the group-channel.json file, find the specified group using the provided groupId, and then add the new channel name to the list of channels for that group. The updated list of groups (with the new channel) will then be written back to the file.
*	Responses indicating success or failure of the operation will be sent back to the client based on the outcome.

How it works:
*	The addChannel.js module is imported and used as a handler for the /addChannel route in the server.js file.
*	Inside addChannel.js, the groupName and groupId values are extracted from the request body.
*	The server then reads the group-channel.json file to fetch the current list of groups.
*	The specified group is found in the list using the provided groupId.
*	The new channel name is added to the list of channels for the found group.
*	The updated list of groups is then written back to the group-channel.json file.
*	The server sends an appropriate response based on whether the operation was successful or if there was an error at any step.


## app.delete('/deleteChannelFromGroup/:channelId/:groupId', require('./routes/deleteChannelFromGroup'));
/deleteChannelFromGroup/:channelId/:groupId - Remove a channel from an existing group
*	HTTP Method: DELETE
*	Endpoint: /deleteChannelFromGroup/:channelId/:groupId
*	Handler: deleteChannelFromGroup.js

Parameters:
*	URL Parameters:
    *	channelId: The identifier of the channel you want to remove.
    *	groupId: The unique identifier of the group from which the channel should be removed.

Return Values:
*	On successful removal of the channel from the group:
    *	success: true
    *	message: "Channel removed from group."
*	On errors (e.g., group not found, channel not found in the group, server error during reading or writing to the file):
    *	success: false
    *	message: A corresponding error message like "Group not found." or "Server error."

Purpose:
*	The purpose of this route is to allow clients to remove a channel from an existing group.
*	When a DELETE request is made to this endpoint, the server will read from the group-channel.json file, find the specified group using the provided groupId, and then remove the specified channel from that group's list of channels. The updated list of groups (without the removed channel) will then be written back to the file.
*	Responses indicating success or failure of the operation will be sent back to the client based on the outcome.

How it works:
*	The deleteChannelFromGroup.js module is imported and used as a handler for the /deleteChannelFromGroup/:channelId/:groupId route in the server.js file.
*	Inside deleteChannelFromGroup.js, the channelId and groupId values are extracted from the request URL parameters.
*	The server then reads the group-channel.json file to fetch the current list of groups.
*	The specified group is found in the list using the provided groupId.
*	If the group contains the specified channel, the channel is removed from the group's list of channels.
*	The updated list of groups is then written back to the group-channel.json file.
*	The server sends an appropriate response based on whether the operation was successful or if there was an error at any step.


## app.delete('/deleteGroup/:groupId', require('./routes/deleteGroup'));
/deleteGroup/:groupId - Remove an existing group
*	HTTP Method: DELETE
*	Endpoint: /deleteGroup/:groupId
*	Handler: deleteGroup.js

Parameters:
*	URL Parameters:
    o	groupId: The unique identifier of the group you want to delete.

Return Values:
*	On successful removal of the group:
    o	success: true
    o	message: "Group deleted successfully."
*	On errors (e.g., group not found, server error during reading or writing to the file):
    o	success: false
    o	message: A corresponding error message like "Group not found." or "Error writing to file."

Purpose:
*	The purpose of this route is to allow clients to delete a group.
*	When a DELETE request is made to this endpoint, the server will read from the group-channel.json file, find the specified group using the provided groupId, and then delete that group from the list. The updated list of groups (without the deleted group) will then be written back to the file.
*	Responses indicating success or failure of the operation will be sent back to the client based on the outcome.

How it works:
*	The deleteGroup.js module is imported and used as a handler for the /deleteGroup/:groupId route in the server.js file.
*	Inside deleteGroup.js, the groupId value is extracted from the request URL parameters and converted to a number.
*	The server then reads the group-channel.json file to fetch the current list of groups.
*	The specified group is found in the list using the provided groupId.
*	If the group is found, it's removed from the list.
*	The updated list of groups is then written back to the group-channel.json file.
*	The server sends an appropriate response based on whether the operation was successful or if there was an error at any step.
*	Just a note: While the logic is correct and should work as intended, always ensure to have backups when working with file operations or have a system to revert changes if something goes wrong, especially in production environments.


## app.delete('/removeUser/:userId/:groupId', require('./routes/removeUser'));
/removeUser/:userId/:groupId - Remove a user from a specific group
*	HTTP Method: DELETE
*	Endpoint: /removeUser/:userId/:groupId
*	Handler: removeUser.js

Parameters:
*	URL Parameters:
    *	userId: The unique identifier of the user you want to remove from a group.
    *	groupId: The unique identifier of the group from which you want to remove the user.

Return Values:
*	On successful removal of the user from the group:
    *	message: "User removed from group successfully."
*	On errors (e.g., user not found, server error during reading or writing to the file):
    *	message: A corresponding error message like "User not found." or "Error writing to the file."

Purpose:
*	The purpose of this route is to remove a user from a specific group.
*	When a DELETE request is made to this endpoint, the server will read from the users.json file, find the specified user using the provided userId, and then remove the groupId from the user's groupids array. The updated user information will then be written back to the file.
*	A response indicating the success or failure of the operation will be sent back to the client based on the outcome.

How it works:
*	The removeUser.js module is imported and used as a handler for the /removeUser/:userId/:groupId route in the server.js file.
*	Inside removeUser.js, the userId and groupId values are extracted from the request URL parameters and converted to numbers.
*	The server then reads the users.json file to fetch the current list of users.
*	The specified user is found in the list using the provided userId.
*	If the user is found, the server will then search for the groupId in the user's groupids array and remove it.
*	The updated user information is then written back to the users.json file.
*	The server sends an appropriate response based on whether the operation was successful or if there was an error at any step.

# Angular Architecture

## Services
UserService (user.service.ts):
*	Description: A service that contains methods for making HTTP requests related to user functionalities.
*	Methods:
    *	getUsers(): Fetches all users.
    *	registerUser(userData): Registers a user with default properties and the given userData.
    *	deleteUser(userId): Deletes a user by the given user ID.
    *	updateUserRole(userId, newRole): Updates the role of a user.
    *	Error Handling: Contains a private method handleError to handle HTTP errors and logs them.


ChatService (chat.service.ts):
*	Description: Service to handle chat functionalities like sending messages and listening for new messages using Socket.io.
*	Properties:
    *	socket: Object for the Socket.io client-side connection.
*	Methods:
    *	sendMessage(message: string): Sends a chat message to the server.
    *	getMessages(): Returns an Observable that emits incoming messages.


## Components
## 1.	 AppComponent (app.component.ts & app.component.html):
*	Description: Main component that displays the navigation bar and contains the login and logout functionality.
*	Properties:
    *	title: Application's title.
    *	email, password: For handling login input fields.
    *	errorMessage: For showing an error message during login.
    *	userList: A hardcoded list of users to check during login (this seems like a temporary solution).
*	Methods:
    *	login(): Handles the login logic.
    *	logout(): Clears session storage and redirects to the login page.

## 2.	LoginComponent (login.component.ts & login.component.html):
*	Description: Component for handling the user login using a form.
*	Properties:
    *	userpwd: Object holding the email and password for the user trying to log in.
*	Methods:
    *	loginfunc(): Logs the user in by making an HTTP request using the httpClient. If the login is successful, it saves user details to sessionStorage and navigates to the dashboard.

## 3.	ProfileComponent (profile.component.ts & profile.component.html):
*	Description: Allows users to view and edit their profile details.
*	Properties:
    *	userProfile: An object that holds the user's profile data, like username and user ID.
*	Methods:
    *	saveChanges(): Saves changes made by the user to sessionStorage.

## 4.	SuperAdminComponent
*	Description: Component for super admins, allowing them to register new users, view a list of users, and update or delete users.
*	Properties:
    *	newUser: Object holding the details (username, email, password) of a user to be added.
    *	users: Array storing the list of all users.
*	Methods:
    *	onSubmit(): Handles the submission of the registration form. Registers a new user via the UserService, adds the new user to the local users list, and provides feedback on success or error.
    *	fetchUserGroups(): Fetches the list of users and updates the users property.
    *	upgradeToSuperAdmin(user: any): Upgrades a user to the role of 'superadmin'.
    *	upgradeToGroupAdmin(user: any): Upgrades a user to the role of 'groupadmin'.
    *	degradeToUser(user: any): Degrades a user to the role of 'user'.
    *	updateUserRole(user: any, newRole: string): A private utility function for updating the role of a user, both locally and on the server side.
    *	deleteUser(user: any): Deletes a user both locally and on the server side using UserService.

## 5.	GroupAdminComponent:
*	Description: Component that provides administrative functionality for managing groups, including CRUD operations on groups, channels, and user-group associations.
*	Properties:
    *	newGroup: Object representing a new group with properties groupid, groupname, and channels.
    *	selectedUser: Holds the selected user.
    *	selectedGroup: Holds the selected group.
    *	selectedChannel: Holds the name of the selected channel.
    *	users: Array of user objects.
    *	groups: Array of group objects.
    *	newChannelName: String representing the name of a new channel.
    *	selectedGroupForChannel: Holds the group where the channel should be added.
*	Methods:
    *	ngOnInit(): Lifecycle hook that fetches all users and groups and checks user role on initialization.
    *	fetchAllUsers(): Fetches all users and sets the users property.
    *	fetchAllGroups(): Fetches all groups and sets the groups property.
    *	addGroup(): Adds a new group.
    *	addUserToGroup(user: any, group: any): Adds a user to a group.
    *	addChannelToGroup(): Adds a channel to a specified group.
    *	removeUserFromGroup(user: any, group: any): Removes a user from a group.
    *	deleteChannelFromGroup(channel: string, group: any): Deletes a channel from a specified group.
    *	deleteGroup(group: any): Deletes a specified group.
*	Dependencies:
    *	UserService: Not directly utilized in the provided code, but it's injected and might be used in a more detailed implementation.
    *	HttpClient: Used for making HTTP requests.
    *	Router: Used for navigating to other components/views.


## 6.	RegisterComponent:
*	Description: Component responsible for user registration, allowing a new user to provide a username, email, and password.
*	Properties:
    *	newUser: Object that holds the details of the user being registered which includes username, email, and password.
*	Methods:
    *	onSubmit(): This method gets triggered when the form is submitted. It invokes the registerUser method from the UserService to register a new user. Depending on the response from the server, it alerts the user about the success or failure of the registration process.


## 7.	DashboardComponent:
*	Description: A component displaying the user's dashboard. The content (specifically links) displayed is dependent on the user's role (user, groupadmin, superadmin).
*	Properties:
    *	userRole: A string that captures the role of the logged-in user. This role is retrieved from the session storage and used to conditionally render content.
*	Methods:
    *	ngOnInit(): An Angular lifecycle hook that gets triggered when the component is initialized. In this method, the user's role is fetched from the session storage and set to the userRole property. If the role is not found, an error is logged to the console.

## 8.	ChatComponent:
*	Description: A component that provides chat functionality. Users can send and view messages.
*	Properties:
    *	message: A string to capture the message typed by the user.
    *	messages: An array of strings that keeps a list of messages sent.
*	Methods:
    *	sendMessage(): Sends the user's message using the ChatService. It also adds the message to the local messages list and resets the input field.


## Models:
User Model (Register):
*	Properties:
    *	username: A string representing the user's name.
    *	email: A string representing the user's email.
    *	password: A string representing the user's password.

Message Model (Chat):
*	Properties:
    *	content: A string representing the content of the message.
