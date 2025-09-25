# 🛍️ SIA-Frontend

SIA-Frontend is a modern web application for managing products and monitoring business operations. Designed for administrators, it provides a user-friendly interface to handle inventory, track orders, and oversee employee activity. Built with React and Tailwind CSS, it connects seamlessly to a Spring Boot backend.

## 🧰 Technologies Used

**Front End:**
- JavaScript
- React
- Tailwind CSS

**Back End:**
- Java Spring Boot
- MySQL

[![My Skills](https://skillicons.dev/icons?i=js,react,tailwind,java,spring,mysql)](https://skillicons.dev)

## 🔐 Backend Implementation Methods

The backend exposes secure RESTful APIs to manage products, orders, and employee data. Key endpoints include:

### 🛒 Product Management
- `GET /api/items`: Fetch all products (with optional category filter)
- `GET /api/items/{id}`: Retrieve product by ID
- `POST /api/items`: Add new product (supports image upload)
- `PUT /api/items/{id}`: Update product details and image
- `DELETE /api/items/{id}`: Delete product
- `GET /api/items/search?name=...`: Search products by name

### 📦 Order Tracking
- `GET /api/orders`: View all orders and statuses
- `PUT /api/orders/{id}`: Update order status

### 👥 Employee Monitoring
- `GET /api/employees`: View employee list
- `POST /api/employees`: Register new employee
- `PUT /api/employees/{id}`: Update employee status or role

### 🔐 Security & Data
- Authentication via encrypted passwords (BCrypt)
- Role-based access control
- Data persistence with JPA and MySQL

## ✨ Frontend Features

- 🔍 Search and filter products
- ➕ Add new products with image upload
- ✏️ Edit product details
- 🗑️ Delete products
- 📊 View top-selling items
- 📦 Track order statuses
- 👤 Monitor employee activity
- 📈 Dashboard with business metrics
