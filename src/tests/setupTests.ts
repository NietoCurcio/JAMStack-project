import '@testing-library/jest-dom/extend-expect'

/*
testing docs:

https://create-react-app.dev/docs/running-tests/
https://jestjs.io/docs/tutorial-react
https://jestjs.io/docs/getting-started
*/

/*
unit test - tests a function, given an input it should be output the expected value. It's decoupled from the application (isolated)

integration test - tests two or more functionality that works together

i.g.:
ListUsersComponent and AddUserComponent

First, we have a unit test for each component
Second, we could have one integration test to check after adding a user it shows in the list

test e2e (end to end) - tests the application in the way that the user will use it (full flow)
e.g.: acess login page, type email, password, click in login button, gets redirected to dashboard

those tests works for all kinds of applications, for example back-end
*/
