# AcademyOS Frontend Authentication Plan

## Components to Create
1. **Registration Component**
   - Form fields: firstName, lastName, email, password, role, phone, dateOfBirth.
   - Handle form submission to call `POST /api/auth/register`.

2. **Login Component**
   - Form fields: email, password.
   - Handle form submission to call `POST /api/auth/login`.

3. **User Profile Component**
   - Fetch user data from `GET /api/auth/me`.
   - Display user information.

4. **Logout Functionality**
   - Call `POST /api/auth/logout` to handle user logout.

## Integration with Backend
- Use Axios for API calls.
- Store JWT token in localStorage for authentication.
- Create a context or state management solution to manage user authentication state.

## Routing
- Set up React Router to navigate between:
  - Registration
  - Login
  - User Profile
  - Home

## Follow-up Steps
- Implement the components based on the plan.
- Test the integration with the backend APIs.
- Ensure proper error handling and user feedback.
