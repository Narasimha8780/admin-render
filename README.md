# Admin-Employee Management System

This repository contains two separate frontend projects and one backend server for an admin-employee management system with role-based login and dashboards.

## Backend Server

- Built with Node.js, Express, and MongoDB.
- Runs on server IP at port 3000.
- Handles authentication for admin, team leads (TL), and employees.
- MongoDB is used for user data storage.
- Start the server with:
  ```
  node server.js
  ```
- Ensure MongoDB is running and accessible.

## Admin Frontend

- Built with Vue.js and Tailwind CSS.
- Contains login page with role selection (admin, TL, employee).
- Redirects users to role-specific dashboards.
- Start the admin frontend with:
  ```
  cd frontend
  npm install
  npm run serve
  ```

## Employee Frontend

- Built with Vue.js and Tailwind CSS.
- Simplified login and dashboard for employees.
- Connects to backend server for authentication and data.
- Can be deployed on employee machines.
- Start the employee frontend with:
  ```
  cd employee-frontend
  npm install
  npm run serve
  ```

## Notes

- Update the backend MongoDB connection string in `server.js` if needed.
- Replace `serverip` in employee frontend API calls with the actual backend server IP.
- Both frontends use Vue Router for navigation.

## Contact

For any issues or questions, please contact the maintainer.
