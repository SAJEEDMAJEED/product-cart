# E-commerce Cart API

A RESTful API for managing user carts in an e-commerce system with user authentication, product management, and cart operations.

## API Collection

We provide two ways to interact with the API documentation:

### 1. Insomnia Collection

The complete API collection is available as an Insomnia export file:  
📁 [`####cart.yaml`]

## Features

- User authentication (register/login)
- Role-based access control (admin/user)
- Product CRUD operations
- Cart management (add/update/remove items)
- Redis caching
- PostgreSQL database
- JWT authentication

## Tech Stack

- Node.js
- Express
- Sequelize (PostgreSQL)
- Redis
- JWT
- Zod (validation)
- Docker

## Installation

### With Docker (Recommended)

1. Clone the repository
2. Create `.env` file from `.env.example`
3. Run:
   ```bash
   docker-compose up --build
   ```

## Without Docker

1. Install PostgreSQL and Redis
2. Create .env file
3. Run:

   npm install
   npm run migrate
   npm run seed # optional
   npm start

Authentication

POST /v1/auth/register - Register new user
POST /v1/auth/login - User login
POST /v1/auth/logout - User logout
Users

POST /v1/user - Create user (admin only)
GET /v1/user - Get all users (admin only)
GET /v1/user/:id - Get user by ID
PUT /v1/user/:id - Update user
DELETE /v1/user/:id - Delete user
Products

POST /v1/product - Create product
GET /v1/product - Get all products
GET /v1/product/:id - Get product by ID
PUT /v1/product/:id - Update product
DELETE /v1/product/:id - Delete product
Cart

POST /v1/cart - Add item to cart
PUT /v1/cart - Update cart item
GET /v1/cart - View cart
DELETE /v1/cart/:productId - Remove item from cart
Database Migrations

npm run migrate # Run migrations
npm run migrate:undo # Rollback last migration
npm run seed # Seed database
npm run seed:undo # Remove seed data
Development

npm run dev # Start with nodemon
License

MIT

text

### 5. How to Export Insomnia Collection

1. In Insomnia, right-click your collection
2. Select "Export" → "Export as JSON"
3. Save the file (e.g., `insomnia-collection.json`)
4. Share this file with your team or include it in your documentation

### 6. How to Start the Project

1. **With Docker**:
   ```bash
   docker-compose up --build
   API will be available at http://localhost:5001
   Adminer (DB GUI) at http://localhost:8080
   Without Docker:
   ```

npm install
npm run migrate
npm start
This setup provides:

Complete Docker environment
Proper API documentation
Clear README instructions
Environment variable management
Database migration support
Redis caching
Role-based access control
The API endpoints match your Insomnia collection exactly, making it easy to test and develop against.
New chat
