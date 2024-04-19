# CloudZone - Ecommerce Project

## Overview

This project is an ecommerce application that consists of both backend and frontend implementations. The backend is built using Node.js and MongoDB, providing the necessary APIs for managing categories, products, orders, users, vouchers and authentication. The frontend is developed with React.js and styled using Tailwind CSS, offering a modern and responsive user interface for customers to browse products, place orders, and manage their accounts.

## Technologies Used

-   **Backend:**

    -   Node.js
    -   Express.js
    -   MongoDB
    -   JSON Web Tokens (JWT) for authentication
    -   Mongoose ODM for MongoDB
    -   Bcrypt for password hashing

-   **Frontend:**
    -   React.js
    -   Tailwind CSS for styling
    -   React Router for routing
    -   Axios for making HTTP requests to the backend
    -   Redux for state management

## Features

### Backend Features

-   RESTful APIs for:
    -   Managing categories (CRUD operations)
    -   Managing products (CRUD operations)
    -   Managing orders (CRUD operations)
    -   Managing users (CRUD operations)
    -   Managing vouchers (CRUD operations)
    -   User authentication (register, login, logout, reset password, refreshToken)
    -   User profile management (update profile, change password)
-   Authentication using JWT Authentication with Asymmetric Encryption
-   Password hashing for user security
-   Handle upload images by multer
-   Send email by google service
-   Handle errors
-   Mocha and Chai unit tests

### Frontend Features

-   Responsive and intuitive user interface
-   Home page displaying featured products
-   Product listing with filtering and pagination
-   Product details page
-   User authentication (register, login, logout, forgot password)
-   User profile management (update profile, change password)
-   Shopping cart functionality
-   Checkout process with order summary
-   Order history for authenticated users
-   Get refresh token auto when access token expire by axios interceptors

## Installation

1. **Clone the repository:**

2. **Backend Setup:**

-   Navigate to the `store-online-backend` directory.
-   Install dependencies:
    ```
    npm install
    ```
-   Set up environment variables (e.g., MongoDB URI, Server, Google auth service) in a `.env` file.
-   Start the backend server:
    ```
    npm start
    ```

3. **Frontend Setup:**

-   Navigate to the `store-online-frontend` directory.
-   Install dependencies:
    ```
    npm install
    ```
-   Set up environment variables (e.g., backend API URL) in a `.env` file.
-   Start the frontend server:
    ```
    npm start
    ```

4. **Accessing the Application:**

-   Once both the backend and frontend servers are running, you can access the application by navigating to `http://localhost:4044` in your web browser.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or feature additions.

## License

This project is licensed under the [MIT License](LICENSE).
