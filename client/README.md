# 🎨 PTM - Client (Frontend)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)

The frontend application for the **Project Tracking Manager (PTM)**, built for speed, accessibility, and a premium user experience.

---

## 🌟 Key Frontend Features

-   **⚡ High Performance**: Powered by Vite for blazing-fast development and optimized production builds.
-   **🎨 Modern UI**: Styled with **Tailwind CSS 4** for advanced design capabilities and minimal configuration.
-   **♿ Accessible Components**: Utilizes **Radix UI** primitives for consistent, keyboard-navigable components (modals, dropdowns, etc.).
-   **🔄 Intelligent State Management**: Combines **Redux Toolkit** for global application state and **TanStack Query** for asynchronous data fetching and caching.
-   **📝 Form Handling**: Managed via **Formik** and validated with **Yup** for a smooth, error-free user input experience.
-   **🛡️ Strong Typing**: Fully written in **TypeScript** to ensure code reliability and a great developer experience.
-   **🔗 Advanced Routing**: Implements **React Router 7** for efficient client-side navigation and protected routes.

---

## 🛠️ Project Structure

```text
src/
├── api/             # API client (Axios instances)
├── app/             # Redux store and global app config
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components (buttons, cards, etc.)
├── features/        # Feature-specific logic (auth, projects)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and library wrappers
├── pages/           # Page-level components (entry points for routes)
└── routes/          # Application routing configuration
```

---

## 🚀 Execution Guide

### 1. Installation

Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 2. Configuration

Create a `.env` file in the `client` root and add your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Development

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
```

---

## 📡 Key Dependencies

-   **React 19**: The latest React features including improved rendering and hooks.
-   **TanStack Table**: For powerful, head-less tables and data grids.
-   **Lucide React**: Beautiful icons for a clean, modern look.
-   **React Hot Toast**: Elegant notification system for user feedback.

---

<p align="center">
  Part of the <b>PTM</b> Ecosystem
</p>
