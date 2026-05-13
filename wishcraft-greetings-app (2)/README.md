# WishCraft — Custom Greetings & Wishes App

> **Premium Personalized Greetings Platform** — Craft beautiful, shareable wishes with your name and photo overlaid on stunning templates.

## ✨ Overview

WishCraft is a production-grade MERN stack application with a vibrant purple-pink light theme. Users create personalized greeting cards, browse templates by category, and share/download their creations. Includes a full Admin Panel for template management and real-time analytics.

## 🚀 Setup

1. Clone the repo
2. Run `npm run install-all`
3. Add `.env` files in `/client` and `/server`
4. Start MongoDB locally
5. Run `npm run seed` to populate templates + admin user
6. Run `npm run dev` to start both servers

**Default Admin:** admin@wishcraft.com / admin123

## 🛠 Tech Stack

**Frontend:** Vite + React 18, React Router v6, Axios, HTML5 Canvas, Framer Motion, React Hot Toast
**Backend:** Node.js + Express, MongoDB + Mongoose, JWT, Bcrypt, Multer
**Admin:** Protected admin routes, analytics tracking, CRUD operations

## 🎨 Design

**Vibrant Purple-Pink Light Theme**
- Primary: `#7C3AED` (Violet)
- Accent: `#F472B6` (Pink)
- Background: `#FFFDFE` (Off-white)
- Surface: `#F8F5FF` (Light purple tint)

## 📱 App Flow

```
Login → Profile Setup → Home (browse) → Editor (personalize) → Share/Download
                                    ↓
                              Admin Panel (template CRUD + analytics)
```

## 🔐 Admin Features

- **Template Manager:** Add, edit, delete greeting cards with image upload
- **Analytics Dashboard:** Views, shares, downloads per template; user activity; category breakdown
- **User Management:** View registered users, guest sessions
