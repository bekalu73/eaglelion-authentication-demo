# Eaglelion Authentication Demo

## 📌 Project Overview

This is an authentication system built using **Next.js**, **React Query**, **Formik**, and **NextAuth.js**. It provides authentication functionalities such as login, forgot password, OTP validation, and reset password.

## 🚀 Tech Stack

- **Next.js 15** - App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and caching
- **Formik** - Form handling
- **Zod & Yup** - Form validation
- **Axios** - API requests
- **Sonner** - Notifications

## 📂 Directory Structure

```
└── bekalu73-eaglelion-authentication-demo/
    ├── README.md
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── Provider/
    │   └── ReactQuery/
    │       └── providers.tsx
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   ├── (auth)/
    │   │   ├── layout.tsx
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── validate-forgot-password/
    │   │       └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   └── reset-password/
    │       └── page.tsx
    ├── components/
    │   ├── FormInput.tsx
    │   ├── OtpInput.tsx
    │   └── PasswordInput.tsx
    ├── hooks/
    │   └── useAuth.ts
    ├── public/
    │   ├── flags/
    │   ├── logos/
    │   └── pattern/
    └── utils/
        ├── api.ts
        └── validation.ts
```

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/eaglelion-authentication-demo.git
   cd eaglelion-authentication-demo
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app should be running at `http://localhost:3000`.

## 🔐 Authentication Features

- **Login with credentials**
- **Forgot password flow** (Username -> OTP validation -> Reset password)
- **API requests using Axios**
- **Form validation with Zod**

## 📜 Available Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the development server                 |
| `npm run build` | Build the application for production         |
| `npm run start` | Run the built application in production mode |
| `npm run lint`  | Run ESLint to check for errors               |

## 📌 Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.66.0",
    "axios": "^1.7.9",
    "formik": "^2.4.6",
    "js-cookie": "^3.0.5",
    "lucide-react": "^0.475.0",
    "next": "15.1.7",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sonner": "^1.7.4",
    "zod": "^3.24.2",
    "zod-formik-adapter": "^1.3.0"
  }
}
```

## ✨ License

This project is **MIT Licensed**.
