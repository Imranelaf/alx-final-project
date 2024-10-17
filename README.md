# ![Property Hub](https://i.ibb.co/R967xSJ/Property-Hub-Logo-White.png) Property Hub

Welcome to **Property Hub**, your trusted partner in real estate. Whether you're looking to buy, sell, or rent properties, our platform is designed to help you achieve your goals with ease. Built using modern web technologies, Property Hub provides a seamless experience for users to manage their real estate needs.

---

## 📚 Introduction

### ALX Africa

<p align="center">
  <img src="https://i.ibb.co/1qkhfxL/331711958-123294657170334-4784535244227879753-n.png" alt="ALX Africa Logo">
</p>

ALX Africa is an innovative education platform that offers intensive training programs in software engineering and other technology-related fields. Through a project-based and peer learning approach, ALX Africa prepares students for careers in the tech industry by providing them with practical skills and industry-relevant knowledge.

For more information about ALX Africa, please visit this [link](https://www.alxafrica.com/).

### Holberton School

<p align="center">
  <img src="https://i.ibb.co/CzCNThD/unnamed-2.png" alt="Holberton School Logo">
</p>

Holberton School is a project-based alternative to college for the next generation of software engineers. Through a peer-learning curriculum and hands-on projects, Holberton School empowers students to become highly skilled and adaptive engineers who can solve complex real-world problems. Holberton's graduates are equipped to excel in a fast-paced and constantly evolving tech industry.

For more information about Holberton School, please visit this [link](https://www.holbertonschool.com/).

---

## 📌 Table of Contents

- [Property Hub](#-property-hub)
  - [📚 Introduction](#-introduction)
    - [ALX Africa](#alx-africa)
    - [Holberton School](#holberton-school)
  - [📌 Table of Contents](#-table-of-contents)
  - [📄 Project Overview](#-project-overview)
  - [🛠️ Getting Started](#️-getting-started)
  - [👥 Team Members](#-team-members)
  - [📜 API Overview](#-api-overview)
  - [🔐 Authentication](#-authentication)
  - [📖 API Endpoints](#-api-endpoints)
    - [Users API](#users-api)
    - [Properties API](#properties-api)
    - [Agents API](#agents-api)
    - [Admin API](#admin-api)
    - [Transactions API](#transactions-api)
  - [🚨 Validation and Error Handling](#-validation-and-error-handling)
  - [📦 Testing](#-testing)
  - [📝 License](#-license)

---

## 📄 Project Overview

**Property Hub** is a comprehensive real estate web application. It allows users to search for properties based on various criteria, create listings, and manage user profiles. The project is divided into two main parts: the **frontend** (client-side) built with React.js and the **backend** (server-side) built with Node.js, Express.js, and MongoDB.

The backend API is designed to manage the core real estate functionalities: managing users, properties, agents, and transactions. The API also includes JWT-based authentication and Google OAuth integration.

---

## 🛠️ Tech Stack & Dependencies

**Property Hub** leverages a modern and scalable tech stack to ensure optimal performance and seamless user experience. Below is a breakdown of the key technologies and tools used:

### 🚀 Backend:
- **Node.js** - JavaScript runtime built on Chrome's V8 engine, used to build a fast and scalable backend.
- **Express.js** - Web framework for Node.js, simplifying the process of building APIs.
- **MongoDB** - NoSQL database providing a flexible, scalable solution for storing property listings, user data, and more.
- **JWT (JSON Web Tokens)** - Secure authentication method used for user verification.
- **Passport.js** - Middleware for authentication, integrated with Google OAuth for seamless user sign-in and sign-up.
  
### 🌐 Frontend:
- **React.js** - A popular JavaScript library for building dynamic and responsive user interfaces.
- **Redux** - State management tool to handle complex application states in a predictable way.
- **HTML5** - The backbone for structuring the web pages of the client-side.
- **CSS3** - Modern stylesheets for responsive and visually engaging UI designs.
- **JavaScript (ES6+)** - Core scripting language for adding interactivity to web pages.

### 📦 DevOps & Utilities:
- **Vite** - Next-generation frontend tooling to serve and build faster React apps.
- **Mongoose** - Elegant MongoDB object modeling for Node.js.
- **Jest** - Testing framework used for ensuring the correctness of our codebase.
- **Supertest** - Library for testing Node.js HTTP servers.
- **ESLint** - Linter tool to maintain code quality and consistency.
  
### ⚙️ Miscellaneous:
- **Git** - Version control system for tracking changes and collaborating on code.
- **Postman** - API client used to test, debug, and document our API endpoints.
- **dotenv** - Environment variable manager to handle sensitive configurations securely.
  
By combining these technologies, **Property Hub** ensures a high-performance, reliable, and user-friendly experience that supports complex real estate operations like property management, agent interactions, and user authentication.


---

## 🛠️ Getting Started

To get a local copy of **Property Hub** up and running, follow these simple steps.

### ⚙️ Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (v14.x or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.x or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - Version control system to clone the repository.

---

### ⚙️ Installation

Follow these steps to install and set up the project locally:

1. **Clone the repository**:

    Open your terminal and run the following command:

    ```bash
    git clone https://github.com/Imranelaf/alx-final-project
    cd property-hub
    ```

2. **Install backend dependencies**:

    Navigate to the `server` folder and install the necessary packages:

    ```bash
    cd server
    npm install
    ```

3. **Install frontend dependencies**:

    Navigate to the client folder and install the necessary packages:

    ```bash
    cd ../client
    npm install
    ```
---

### 🔑 Environment Variables

To run this project, you will need to set up the following environment variables in your project.

#### Backend Environment Variables

Create a `.env` file in the `server` directory and add the following:

```bash
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI="<mongodb-uri>"

# JWT Configuration
JWT_SECRET="<your-jwt-secret>"
JWT_COOKIE_NAME="propertyHubAuthToken"
JWT_EXPIRES_IN="3d"
JWT_ISSUER="propertyHub"
JWT_AUDIENCE="propertyHubApp"

# Google OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID="<google-oauth-client-id>"
GOOGLE_OAUTH_CLIENT_SECRET="<google-oauth-client-secret>"
GOOGLE_OAUTH_SIGNUP_REDIRECT_URI="<google-signup-redirect-uri>"
GOOGLE_OAUTH_SIGNIN_REDIRECT_URI="<google-signin-redirect-uri>"

# Client Configuration (Frontend)
CLIENT_URI="<frontend-client-uri>"

# Node Environment
NODE_ENV="development"
```

#### Frontend Environment Variables

Create a `.env` file in the `client` directory and add the following:

```bash
# API Configuration
VITE_API_URL="<backend-server-uri>"

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME="<cloudinary-cloud-name>"
VITE_CLOUDINARY_UPLOAD_PRESET="<cloudinary-upload-preset>"

# JWT Configuration
VITE_JWT_COOKIE_NAME="propertyHubAuthToken"
```

---

## 📜 API Documentation

## 🔐 Authentication

The authentication system in **Property Hub** includes routes for both local authentication and Google OAuth. These routes allow users, admins, and agents to register, log in, and manage authentication sessions using JWT tokens.

### Authentication Endpoints

#### Google OAuth Authentication

| Method | Endpoint                           | Description                                              |
|--------|------------------------------------|----------------------------------------------------------|
| GET    | `/api/auth/google/signup`          | Initiates the Google OAuth sign-up process.               |
| GET    | `/api/auth/google/signin`          | Initiates the Google OAuth sign-in process.               |
| GET    | `/api/auth/google/signup/callback` | Callback for handling Google OAuth sign-up and token generation. |
| GET    | `/api/auth/google/signin/callback` | Callback for handling Google OAuth sign-in and token generation. |

- **Google OAuth Signup**: After the user authenticates with Google, they will be redirected to the `/signup/success` or `/signup/failure` URL, depending on the result.
- **Google OAuth Signin**: After signing in with Google, users are redirected to `/signin/success` or `/signin/failure`.

#### Local Authentication (Users)

| Method | Endpoint                 | Description                             |
|--------|--------------------------|-----------------------------------------|
| POST   | `/api/auth/signup`        | Registers a new user account.           |
| POST   | `/api/auth/signin`        | Logs in a user and returns a JWT token. |
| POST   | `/api/auth/logout`        | Logs out the current user and clears the JWT cookie. |
| GET    | `/api/auth/check-username/:username` | Checks if a username is available. |
| GET    | `/api/auth/check-email/:email`       | Checks if an email is already registered. |

#### Admin Authentication

| Method | Endpoint                  | Description                             |
|--------|---------------------------|-----------------------------------------|
| POST   | `/api/auth/admins/signup`  | Registers a new admin account (Super Admin only). |
| POST   | `/api/auth/admins/login`   | Logs in an admin and returns a JWT token. |

- **Admin Signup**: Admins are created only by a super admin. JWT tokens are issued upon successful registration.
- **Admin Login**: Admins log in using their credentials and receive a JWT token to authenticate future requests.

#### Agent Authentication

| Method | Endpoint                 | Description                             |
|--------|--------------------------|-----------------------------------------|
| POST   | `/api/auth/agents/signup` | Registers a new agent account.          |
| POST   | `/api/auth/agents/login`  | Logs in an agent and returns a JWT token. |

- **Agent Signup**: Any user can register as an agent, and a JWT token is issued upon successful registration.
- **Agent Login**: Agents log in using their credentials and receive a JWT token to authenticate future requests.

### Token-Based Authentication (JWT)

**JWT (JSON Web Token)** is used for securing endpoints. Upon successful login or sign-up, a JWT token is issued and stored as a cookie on the client side. This token must be included in subsequent requests to authenticate the user.

**Cookie Name**: The JWT token is stored in a cookie named `propertyHubAuthToken`.

### Example Requests

#### 1. **User Signup (Local)**

```bash
POST /api/auth/signup

{
  "firstName": "Abdessamad",
  "lastName": "Haddouche",
  "username": "abdessamad",
  "email": "abdessamad.hadd@gmail.com",
  "password": "Password123"
}
```
Response

```bash
{
    "success": true,
    "message": "User registered successfully.",
    "data": {
        "firstName": "Abdessamad",
        "lastName": "Haddouche",
        "username": "abdessamad",
        "email": "abdessamadhadd@gmail.com",
        "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png",
    }
}
```

#### 2. **User Login (Local)**

```bash
POST /api/auth/signin

{
  "email": "abdessamadhadd@gmail.com",
  "password": "Password123"
}
```
Response

```bash
{
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "abdessamad",
    "email": "abdessamadhadd@gmail.com",
    "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
  }
}
```

#### 3. **Admin Signup**

```bash
POST /api/auth/admins/signup

{
  "firstName": "Abdessamad",
  "lastName": "Haddouche",
  "username": "adminsuper",
  "email": "abdessamad.super@gmail.com",
  "phoneNumber": "+1234567890",
  "password": "AdminPass123"
}
```
Response

```bash
{
  "success": true,
  "message": "Admin created successfully.",
  "data": {
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "adminsuper",
    "email": "abdessamad.super@gmail.com"
    "phoneNumber": "+1234567890",
  }
}
```

#### 4. **Admin Login**

```bash
POST /api/auth/admins/login

{
  "email": "abdessamad.super@gmail.com",
  "password": "AdminPass123"
}

```
Response

```bash
{
  "success": true,
  "message": "Admin logged in successfully!",
  "data": {
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "adminsuper",
    "email": "abdessamad.super@gmail.com",
    "phoneNumber": "+1234567890",
  }
}
```

#### 5. **Agent Signup**

```bash
POST /api/auth/agents/signup

{
  "firstName": "Agent",
  "lastName": "Smith",
  "username": "agentsmith",
  "email": "agentsmith@example.com",
  "phoneNumber": "+1234567891",
  "agency": "Real Estate Co.",
  "licenseNumber": "12345678",
  "password": "AgentPass123"
}

```
Response

```bash
{
  "success": true,
  "message": "Agent created successfully.",
  "data": {
    "username": "agentsmith",
    "email": "agentsmith@example.com",
    "_id": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 6. **Agent Login**

```bash
POST /api/auth/agents/login

{
  "email": "agentsmith@example.com",
  "password": "AgentPass123"
}
```
Response

```bash
{
  "success": true,
  "message": "Agent logged in successfully!",
  "data": {
    "username": "agentsmith",
    "email": "agentsmith@example.com",
    "_id": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 7. **User Logout**

```bash
POST /api/auth/logout
```
Response

```bash
{
  "success": true,
  "message": "User logged out successfully."
}
```

#### 8. **Check if Username is Available**

```bash
GET /api/auth/check-username/johndoe
```
Response

```bash
{
  "success": true,
  "available": false
}
```

#### 9. **Check if Email is Registered**

```bash
GET /api/auth/check-email/johndoe@example.com
```
Response

```bash
{
  "success": true,
  "available": false
}
```

---

### 👤 User Management

The User Management API allows for managing user profiles, updating information, and handling user-specific property listings. This section includes endpoints for retrieving user data, updating profiles, and adding/removing properties associated with users.

### User Management Endpoints

| Method | Endpoint                          | Description                                                |
|--------|-----------------------------------|------------------------------------------------------------|
| GET    | `/api/users`                      | Retrieves a list of users based on filters (public access). |
| GET    | `/api/users/:id`                  | Retrieves a specific user by their ID (public access).      |
| PUT    | `/api/users/:id`                  | Updates user information (admin or user-only).              |
| DELETE | `/api/users/:id`                  | Deletes a user (admin or user-only).                        |
| POST   | `/api/users/:userId/add-property` | Adds a property to the user's list (admin or user-only).    |
| PUT    | `/api/users/:userId/remove-property` | Removes a property from the user's list (admin or user-only). |

### User Management Actions

- **Get All Users**: Fetches a list of all users with optional filtering capabilities.
- **Get User by ID**: Retrieves detailed information for a specific user by their unique ID.
- **Update User**: Allows a user or an admin to update profile information, such as email or username.
- **Delete User**: Deletes a user account, either by the user themselves or by an admin.
- **Add Property to User**: Allows the user to add a property to their list of owned or managed properties.
- **Remove Property from User**: Removes a property from the user's list of owned or managed properties.

### Example Requests

#### 1. **Get Users by Filter**

```bash
GET /api/users
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "username": "abdessamad",
      "email": "abdessamadhadd@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    },
    {
      "_id": "67110e193f6922174bc674a5",
      "firstName": "Imrane",
      "lastName": "ALI LAFKIH",
      "username": "irmanelaf",
      "email": "imranelaf@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    }
  ]
}
```

```bash
GET /api/users?firstName=Abdessamad
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "username": "abdessamad",
      "email": "abdessamadhadd@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    }
  ]
}
```

```bash
GET /api/users?email=abdessamadhadd@gmail.com&accountStatus=active
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "username": "abdessamad",
      "email": "abdessamadhadd@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png",
      "accountStatus": "active"
    }
  ]
}
```

#### 2. **Get User by ID**

```bash
GET /api/users/67110e193f6922174bc674a4
```
Response

```bash
{
  "success": true,
  "data": {
    "_id": "67110e193f6922174bc674a4",
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "abdessamad",
    "email": "abdessamadhadd@gmail.com",
    "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
  }
}
```

#### 3. **Update User**

```bash
PUT /api/users/67110e193f6922174bc674a4

{
  "firstName": "Abdessamad",
  "lastName": "Haddouche",
  "username": "abdessamad",
  "email": "newemail@gmail.com"
}
```

Response

```bash
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "67110e193f6922174bc674a4",
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "abdessamad",
    "email": "newemail@gmail.com"
  }
}
```

#### 4. **Delete User**

```bash
DELETE /api/users/67110e193f6922174bc674a4
```
Response

```bash
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### 5. **Add Property to User**

```bash
POST /api/users/67110e193f6922174bc674a4/add-property

{
  "propertyId": "5f5a8c7e3c6d281f8e8a7a3c"
}
```

Response

```bash
{
  "success": true,
  "message": "Property added to user's list",
  "data": {
    "propertyId": "5f5a8c7e3c6d281f8e8a7a3c",
    "userId": "67110e193f6922174bc674a4"
  }
}
```

#### 6. **Remove Property from User**

```bash
PUT /api/users/67110e193f6922174bc674a4/remove-property

{
  "propertyId": "5f5a8c7e3c6d281f8e8a7a3c"
}
```
Response

```bash
{
  "success": true,
  "message": "Property removed from user's list",
  "data": {
    "propertyId": "5f5a8c7e3c6d281f8e8a7a3c",
    "userId": "67110e193f6922174bc674a4"
  }
}
```

#### 7. **Check if Email is Registered**

```bash
GET /api/auth/check-email/johndoe@example.com

```bash
```
Response

```bash

```

#### 8. **Check if Email is Registered**

```bash
GET /api/auth/check-email/johndoe@example.com

```bash
```
Response

```bash

```

---

### 🏘️ Property Management

### Example Requests

---

### 👨‍💼 Agent Management

### Example Requests

---

### 🛠️ Admin Management

### Example Requests

---

### 💰 Transaction Management

### Example Requests

---

### ❓ FAQ Management

### Example Requests

---

## 🗂️ Database Schema

---

## 🧪 Testing

---

## 👥 Contributors

---

## 📝 License
