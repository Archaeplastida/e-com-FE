# Nile Frontend - E-commerce Platform

## Overview

This is the frontend React application for the Nile e-commerce platform. It provides the user interface for browsing products, user authentication, managing shopping carts, and interacting with the backend API. Built with React and Material UI, the frontend aims to be responsive, user-friendly, and visually appealing.

## Technologies Used

*   **React:** JavaScript library for building user interfaces.
*   **React Router:** For client-side routing and navigation.
*   **Material UI (MUI):**  A React UI framework for creating a consistent and modern design.
*   **Context API:** For managing authentication state globally across the application.
*   **JavaScript (ES6+):**  For application logic and API interactions.
*   **axios:** For making HTTP requests to the backend API.
*   **jwt-decode:** For decoding JWT tokens on the client-side.

## Setup Instructions (If you want to run locally)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Archaeplastida/e-com-FE
    cd e-com-FE
    ```
2.  **Install dependencies:**
    ```bash
    npm install  # or yarn install
    ```
3.  **Environment Variables:** 
    *   Create a `.env` file in the root directory.
    *   Add any necessary environment variables, for example:
        ```
        REACT_APP_API_BASE_URL=http://localhost:3001 # Or your backend API URL
        ```
4.  **Start the development server:**
    ```bash
    npm start # or yarn start
    ```
    The frontend application will be accessible at `http://localhost:3000` (or another port if specified).

## Frontend Routes and Components

The application is structured using React Router to handle different pages and views. Here's a summary of the main routes and their corresponding components:

| Path                                 | Component             | Description                                         |
| :----------------------------------- | :-------------------- | :-------------------------------------------------- |
| `/`                                  | `Home`                | Homepage - displays product listings, categories, etc. |
| `/register`                           | `Register`            | User registration page.                               |
| `/login`                              | `Login`               | User login page.                                    |
| `/products/search/:searchQuery`      | `SearchProducts`      | Displays search results for a given query.          |
| `/products/:tagName`                 | `TagProducts`         | Displays products filtered by a specific tag/category. |
| `/products/id/:product_id`           | `ProductPage`         | Detailed page for a single product.                 |
| `/products/create`                    | `ProductCreationForm` | Form for logged-in users to create new product listings.|
| `/products/id/:product_id/edit`      | `ProductEdittingForm` | Form for logged-in users to edit their product listings.|
| `/cart`                               | `Cart`                | Shopping cart page for logged-in users.             |
| `*`                                  | `BadRouteHandler`     | Redirects back to `/`         |

**Key Components:**

*   **`App.js`:**  Main application component, sets up routing using `BrowserRouter`, and provides the `AuthProvider`.
*   **`AuthContext.js`:**
    *   `AuthProvider`:  Provides the authentication context to the application. Manages JWT token storage in `localStorage`, user login, logout, and token verification.
    *   `AuthContext`:  Context object to access authentication state and functions (`token`, `username`, `login`, `logout`) in components.
*   **`Navbar`:** Navigation bar component `/components/Navbar.js`, handles site navigation, search bar, login/logout actions, and category links.
*   **Route Components (in `/routes` directory):**
    *   `Home`, `Register`, `Login`, `SearchProducts`, `TagProducts`, `ProductPage`, `ProductCreationForm`, `ProductEdittingForm`, `Cart`, `BadRouteHandler`:  These components represent different pages or views of the application and handle data fetching, rendering, and user interactions for their respective routes.
*   **`ProductCard` in `/components/ProductCard.js`:** Reusable component to display product information in a card format, used in product listings and search results.

## Authentication Context (`AuthContext`)

The `AuthContext` is crucial for managing user authentication state.

*   **`token` state:** Stores the JWT token obtained after successful login.
*   **`username` state:** Stores the username of the logged-in user.
*   **`login(token, username)` function:**
    *   Sets the `token` and `username` state.
    *   Stores the `token` and `username` in `localStorage` for persistent login sessions.
*   **`logout()` function:**
    *   Calls the backend API `/auth/logout` to invalidate the session (optional backend implementation).
    *   Removes `token` and `username` from `localStorage`.
    *   Clears the `token` and `username` state, effectively logging the user out on the frontend.
*   **`useEffect` hook in `AuthProvider`:**
    *   On initial load, checks for `token` and `username` in `localStorage`.
    *   If found, verifies the token with the backend API `/auth/verify`.
    *   If the token is valid and username matches the decoded token, sets the `token` and `username` state to maintain a logged-in session.
    *   If token is invalid or not found, logs the user out.

## API Interactions

The frontend application interacts with the backend API (documented in the backend `readme.md`) to perform actions such as:

*   User registration and login (`/auth/register`, `/auth/login`).
*   Logging out (`/auth/logout`).
*   Verifying token validity (`/auth/verify`).
*   Fetching product listings (`/products`).
*   Fetching products by tag (`/products/tag/:tagName`).
*   Fetching product details (`/products/id/:product_id`).
*   Creating new products (`/products/create`).
*   Editing products (`/products/:product_id`).
*   Adding/removing items from the cart (`/users/cart`).
*   Fetching cart items (`/users/cart`).
*   Rating products (`/products/:product_id/rate`).
*   Searching products (`/products/search/:searchQuery` - implementation details may vary).