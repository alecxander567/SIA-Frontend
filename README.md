# SIA-Frontend

SIA-Frontend is a simple and modern web application for managing products and monitoring business operations. Designed for administrators, it provides a user-friendly front end and a robust backend, allowing seamless product management, order tracking, and employee status monitoring.

## Technologies Used

**Front End:**
- JavaScript
- React
- Tailwind CSS

**Back End:**
- Java Spring Boot
- MySQL

[![My Skills](https://skillicons.dev/icons?i=js,react,tailwind,java,spring,mysql)](https://skillicons.dev)

## Backend Implementation Methods

The backend leverages Spring Boot and exposes secure RESTful APIs to manage products, orders, and employee data. Key methods and approaches include:

- **Product Management:**
  - `GET /api/items`: Fetch all products (optionally filter by category).
  - `GET /api/items/{id}`: Retrieve a specific product by ID.
  - `POST /api/items`: Add a new product (with image upload support).
  - `PUT /api/items/{id}`: Edit an existing product, including updating its image.
  - `DELETE /api/items/{id}`: Remove a product by ID.
  - `GET /api/items/search?name=...`: Search for products by name.

- **Order Tracking:**
  - `GET /api/orders`: View all orders and their statuses.
  - Order management endpoints allow for status updates and analysis.

- **Employee Status Monitoring:**
  - Employee data is managed through dedicated endpoints for registration, authentication, and role assignments.
  - Includes endpoints for viewing and updating employee statuses.

- **Security & Data Management:**
  - User authentication is handled with encrypted passwords (BCrypt).
  - Data is persisted in a MySQL database via JPA repositories.
  - All business logic and validation are enforced in the backend service layer.

## Features

- View all products
- Add new products
- Edit existing products
- Delete products
- Track order status
- Monitor employee statuses
- View analysis for top-selling items

## Getting Started

### Prerequisites

- Node.js and npm (for running the front end)
- Java (for running the backend)
- MySQL (for the database)
