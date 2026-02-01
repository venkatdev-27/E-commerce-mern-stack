# LuxeMarket

LuxeMarket is a premium e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides a complete solution for online retail, featuring a responsive customer frontend, a powerful admin dashboard, and a robust backend API.

## 🚀 Features

### Customer Frontend (`/frontend`)
*   **Product Browsing**: Browse products by category with detailed views.
*   **User Accounts**: Secure sign-up and login functionality.
*   **Shopping Experience**: Add items to cart and place orders.
*   **Wishlist**: Save favorite items for later.
*   **Order History**: View past orders and status.
*   **Support**: Send support messages to the administration.

### Admin Dashboard (`/admin-frontend`)
*   **Dashboard Analytics**: Overview of sales, orders, and user statistics.
*   **Product Management**: Create, read, update, and delete products (CRUD).
*   **Order Management**: View and manage customer orders.
*   **User Management**: Monitor registered users.
*   **Support Tickets**: View and respond to customer support inquiries.

### Backend API (`/backend`)
*   **RESTful Architecture**: Clean and organized API routes.
*   **Authentication**: Secure JWT-based authentication for Users and Admins.
*   **Database**: MongoDB integration with Mongoose schemas.
*   **Media Handling**: Image uploads supported via Multer.
*   **Email Notifications**: Integrated with SendGrid for email services.

## 🛠 Tech Stack

*   **Frontend**: React, Vite, Redux Toolkit, Axios, Lucide React.
*   **Admin**: React, Vite, Recharts, React Hook Form.
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT).
*   **DevOps**: Docker, Docker Compose.

## 📋 Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
*   [SendGrid Account](https://sendgrid.com/) (for email features)

## ⚙️ Environment Variables

Create a `.env` file in the respective directories with the following variables:

### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxemarket
JWT_SECRET=your_super_secret_key
SENDGRID_API_KEY=SG.your_sendgrid_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Admin Frontend (`/admin-frontend/.env`)
```env
VITE_ADMIN_API_BASE_URL=http://localhost:5000/api/admin
```

## 📦 Installation & Setup

### Option 1: Docker (Recommended)

Run the entire stack with a single command:

```bash
docker-compose up --build
```
*   **Backend**: Running on `http://localhost:5000`
*   **Frontend**: Running on `http://localhost:4173`
*   **Admin Frontend**: Running on `http://localhost:5173`

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is set up
npm start
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (usually, check console)
```

#### 3. Admin Frontend Setup
```bash
cd admin-frontend
npm install
npm run dev
# Runs on http://localhost:5174 (if 5173 is busy)
```

## 📂 Project Structure

```
luxemarket/
├── backend/            # Express.js API Server
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── uploads/        # Static file uploads
├── frontend/           # Customer React Application
│   ├── src/
│   │   ├── api/        # API integration
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page views
│   │   └── store/      # Redux state management
├── admin-frontend/     # Admin React Application
│   ├── src/
│   │   ├── components/
│   │   └── pages/
└── docker-compose.yml  # Docker orchestration
```

## 🔐 API Documentation (Brief)

*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - User login
*   `GET /api/products` - Get all products
*   `POST /api/admin/auth/login` - Admin login

_For full API details, refer to the backend routes directory._
