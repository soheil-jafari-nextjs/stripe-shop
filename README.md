# Full Stack E-Commerce

A production-ready full-stack e-commerce application built with **Next.js**, **NestJS**, **PostgreSQL**, **Prisma**, and **Docker**.

The project includes complete authentication, shopping cart, order management, Stripe payment integration, shipping management, and production deployment using Docker Compose and Nginx Reverse Proxy.

---

## 🚀 Features

### Authentication

- OTP Login
- Password Login
- JWT Authentication
- Access Token & Refresh Token
- Automatic Token Refresh
- Secure HTTP-Only Cookies
- Logout
- Role-Based Access Control (User / Admin)

---

### E-Commerce

- Product Management
- Shopping Cart
- Guest Cart (Local Storage)
- User Cart (Database)
- Automatic Cart Merge after Login
- Inventory Validation
- Order Management
- Shipping Management

---

### Payment

- Stripe Checkout
- Stripe Webhooks
- Transaction Management
- Payment Verification
- Order Status Updates

---

### Admin Panel

- Product CRUD
- Order Management
- Transaction Management
- Shipping Management
- User Role Protection

---

### DevOps

- Docker
- Docker Compose
- PostgreSQL Container
- Nginx Reverse Proxy
- Linux VPS Deployment
- SSL
- Domain Configuration
- UFW Firewall
- SSH Authentication

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- Node.js
- Prisma ORM
- PostgreSQL

### Authentication

- JWT
- Refresh Token Rotation
- Cookies

### Payment

- Stripe

### DevOps

- Docker
- Docker Compose
- Nginx
- Linux
- GitHub

---

## 🏗 Architecture

```
Internet
      │
      ▼
 Nginx Reverse Proxy
      │
 ┌────┴────┐
 ▼         ▼
Next.js   NestJS
             │
             ▼
       PostgreSQL
```

---

## 📷 Screenshots

(Add screenshots here)

---

## 🎥 Demo

(Add demo video here)

---

## ⚙️ Installation

```bash
git clone ...

docker compose up --build
```

---

## Environment Variables

Create your own `.env` files.

Required variables include:

- Database URL
- JWT Secrets
- Stripe Keys

---

## Future Improvements

- GitHub Actions (CI/CD)
- Redis
- BullMQ
- WebSocket
- Unit Testing
- Integration Testing
- Microservices

---

## License

MIT