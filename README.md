## Getting Started

## Technology

- Nest js
- Typescript
- PostgreSQL
- Prisma
- Redis
- SMTP
- Docker

## Running the Project

### Option 1: Run with Docker (Recommended)

Navigate to the project folder and run the following command(make sure docker is running on the system):

```bash
docker-compose up --build
```

or

```bash
docker compose up --build
```

Docker will handle all dependencies, including PostgreSQL and Node.js, making setup simpler. <br>

Note: If you encounter any errors while running the application, try removing the Docker containers, images, and volumes, then rebuild and run the app again.

- The backend server will be accessible at `http://localhost:5015/api/v1`.
- The DB will be accessible at `http://localhost:5432`.
- The redis will be accessible at `http://localhost:6379`.

### Option 2: Run without Docker

Ensure the following are installed:

- **PostgreSQL** (version 16 or above recommended)
- **Node.js** (version 18 or above)

#### Steps

- If system does not have Redis installed. Then run(in root folder)
  ```
  docker compose up redis --build
  ```
  Note: Make sure redis is running.
- Navigate to the `Backend` folder.
- Can modify configuration from `configs/.env.development`
- Install dependencies and set up the database:
  ```bash
  npm install
  npm run migrate:dev
  npm run seed:run
  npm run dev
  ```
  This will configure the database and seed it with some dummy data. The backend server will be accessible at `http://localhost:5015/api/v1`.

---

## Milestones
### Core Features

- [Service Listing API](#2-get-all-services-paginated-get---authorization-not-required)
- [Service Booking API](#1-create-or-make-a-booking-post---authorization-not-required)
- [Booking Status API](#4-get-booking-status-by-id-get---authorization-not-required)

### Bonus Features
- [Add/edit/delete services](#service-api)
- [View all bookings](#2-get-all-bookings-paginated-get---authorization-required)
- Authentication - JWT/session-based for admin endpoints (Need token for some api access can me found into API Documantation)
- [Send SMS/email notifications when a booking is confirmed](#6-update-booking-status-put---authorization-required)
- Dockerize the app (Backend,DB and Redis are docerized)

### Unit Testing
[This command](#running-the-test-case) will test follwing cases:
- Service listing
- Booking creation
- Booking status retrieval

---
## Running the Test case

Note: for test run user do not need redis or run docker setup or anything. <br/>
Go to backend folder and run

```
npm run test
```


# API Documantation

Note: Here some api required authorization Bearer token. User can get token after successful login. And have to pass with headers 'authorization Bearer token'.

### Default Credentials

```
  {
    email:'admin@test.test',
    phone: '8801711355057',
    password:'123456',
    role:'SUPER_ADMIN'
  },
  {
    email:'manager@test.test',
    phone: '8801711355059',
    password:'123456',
    role:'MANAGER'
  }

```
## Auth API

### 1. Login API

**Endpoint**: `POST: /auth/login`

### Request Body:

```json
{
  "identifier": "admin@test.test",
  "password": "123456"
}
```

**Fields:**

- `identifier`: The email or phone number of the user (string).
- `password`: The password associated with the account (string).

### Response:

**200 OK** (if login is successful):

```json
{
    "status": 200,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "uid": "MANUSH-123987",
            "email": "admin@test.test",
            "phone": "01711355057",
            "name": "Abir Rahman",
            "status": "PENDING",
            "userWeight": 10,
            "isMfaEnabled": false,
            "loginAttempts": 0,
            "isPasswordValid": true,
            "isPasswordResetRequired": false,
            "lastPasswordResetDate": "2025-05-09T04:08:20.942Z",
            "createdAt": "2025-05-09T04:08:20.948Z",
            "updatedAt": "2025-05-09T04:08:20.948Z",
            "roleId": 1,
            "roleInfo": {
                "id": 1,
                "role": "SUPER_ADMIN",
                "context": "MT"
            }
        },
        "token": <token>
    }
}
```

---

## Service API

This API allows for CRUD operations on Services, with features like pagination, creation, updating, and deletion.

### 1. Create a Service (POST - authorization required)

**Endpoint**: `POST: /services`

**Request Body**:

```json
{
  "name": "Service Name",
  "category": "Service Category",
  "price": 99.99,
  "description": "A detailed description of the service"
}
```

### 2. Get All Services (Paginated) (GET - authorization not required)

**Endpoint**: `GET: /services`

**Query Parameters**:

- `page`: The page number (default: `1`)
- `limit`: The number of services per page (default: `10`)

Example Request:

```
GET /services?page=1&limit=10
```

### 3. Get a Single Service (GET - authorization not required)

**Endpoint**: `GET: /services/:id`

### 4. Update a Service (PUT - authorization required)

**Endpoint**: `PUT: /services/:id`

**Request Body**:

```json
{
  "name": "Updated Service Name",
  "category": "Updated Service Category",
  "price": 149.99,
  "description": "Updated description of the service"
}
```

### 5. Delete a Service (DELETE - authorization required)

**Endpoint**: `DELETE: /services/:id`

---

## Service Booking API

Note: Default service IDs 1,2,3,4

### 1. Create or Make a Booking (POST - authorization not required)

**Endpoint**: `POST: /service-bookings`

### Request Body:

```json
{
  "customerName": "Customer 1",
  "phone": "+8801414436321",
  "email": "test@gamil.com",
  "serviceId": 1
}
```
Note: Once the booking status is confirmed, a confirmation email will be sent to the provided email address.

### 2. Get All Bookings (Paginated) (GET - authorization required)

**Endpoint**: `GET: /service-bookings?page=1&limit=10`

### 3. Get Booking by ID (all info) (GET - authorization required)

**Endpoint**: `GET: /service-bookings/:id`

### 4. Get Booking status by ID (GET - authorization not required)

**Endpoint**: `GET: /service-bookings/get-status/:id`

### 5. Update Booking (PUT - authorization required)

**Endpoint**: `PUT:  /service-bookings/:id`

### Request Body:

```json
{
  "bookingDate": "2025-05-15T14:30:00.000Z",
  "notes": "Updated notes"
}
```

### 6. Update Booking Status (PUT - authorization required)

**Endpoint**: `PUT:  /service-bookings/status-update/:id`
<br/>Will send email to user if updated status is confirmed.

### Request Body:

```json
{
  "status": "CONFIRMED"
}
```

### 7. Delete Booking (DELETE - authorization required)

**Endpoint**: `DELETE: /service-bookings/:id`
