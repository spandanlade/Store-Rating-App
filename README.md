# Store Rating App

A full-stack web application that allows users to rate stores, store owners to view ratings for their stores, and administrators to manage users and stores.

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database

- MySQL

---

## Features

### Authentication

- User Registration
- User Login
- JWT-based Authentication
- Role-based Authorization

### Admin Features

- Dashboard Statistics
- Create Users
- Create Stores
- View All Users
- View All Stores
- Filter Users
- Sort Users
- View User Details

### User Features

- Register Account
- Login
- View Stores
- Search Stores
- Submit Ratings
- Update Ratings

### Store Owner Features

- View Store Dashboard
- View Average Store Rating
- View Users Who Submitted Ratings

### Common Features

- Update Password
- Logout

---

## Project Structure

```text
Store-Rating-App/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

---

### Backend Setup

```bash
cd backend

npm install

npm start
```

Server runs on:

```text
http://localhost:3000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Application runs on:

```text
http://localhost:5173
```

---

## Backend Configuration

Update database connection in:

backend/db/connection.js

Set your local MySQL credentials before running the project.

---

## Roles

### ADMIN

- Manage users
- Manage stores
- View dashboards and statistics

### USER

- Register
- Login
- Rate stores
- Update ratings

### OWNER

- View ratings for owned stores
- View average store rating

## 🔐 Default Admin Login

To access the system initially, use the following admin account:

Email: admin@test.com  
Password: Admin@123

## Role: ADMIN

## Author

Spandan Lade
