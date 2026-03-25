# ⚙️ PTM - Server (Backend)

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

The backend API for the **Project Tracking Manager (PTM)**, designed for security, scalability, and modularity.

---

## 🔒 Key Backend Features

- **🔑 Robust Authentication**: Secure JWT-based authentication with high-level access control.
- **🔄 Refresh Token Strategy**: Advanced logic to handle token rotation and session persistence.
- **📦 Database Management**: Powered by **MongoDB** with **Mongoose** as the ODM for clean schema design.
- **🛡️ Validation & Sanitization**: Integrated with **Yup** or custom validators for data integrity.
- **🚀 RESTful API Architecture**: Follows best practices for clean, scalable, and discoverable endpoints.
- **🔍 Error Handling**: Unified and descriptive error responses for smooth frontend integration.
- **🏗️ Modular Design**: Clean Separation of Concerns (SoC) between controllers, routes, and models.

---

## 🏗️ Project Structure

```text
src/
├── controllers/     # Business logic handlers
├── middleware/      # Auth, logging, and validation middlewares
├── models/          # Mongoose schema definitions
├── routes/          # API endpoint definitions
├── services/        # Auxiliary services (email, DB utils, etc.)
├── utils/           # Utility functions (token generators, formatters)
└── server.ts        # Application entry point
```

---

## 🚀 Execution Guide

### 1. Installation

Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 2. Configuration

Create a `.env` file in the `server` root and add your configuration:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

---

## 📡 Built With

- **Express.js**: Fast, unopinionated, minimalist web framework.
- **Mongoose**: Elegant mongoDB object modeling for node.js.
- **Cors**: CORS middleware for cross-origin protection.
- **Bcrypt**: Library for hashing passwords and securing data.

---

<p align="center">
  Part of the <b>PTM</b> Ecosystem
</p>
