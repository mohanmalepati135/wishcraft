# WishCraft — Application Description

## Executive Summary

**WishCraft** is a premium, full-stack MERN application that empowers users to create personalized digital greeting cards and wishes. Built with a vibrant purple-pink light theme, WishCraft combines modern design with powerful HTML5 Canvas-based image manipulation. Includes a full Admin Panel with analytics tracking.

---

## Core Value Proposition

In a world of generic digital messages, WishCraft enables users to create **meaningful, personalized greetings** that stand out.

---

## Feature Architecture

### 1. Authentication & Onboarding
- **Multi-modal Login**: Email/Password, Google OAuth 2.0, Guest Login
- **Profile Setup Flow**: Name + profile photo capture
- **JWT-based Session Management**
- **Admin Role**: Dedicated admin with protected routes

### 2. Template Discovery Engine
- **10 Categories**: All, Shayari, Birthday, Anniversary, Festivals, Joke, Updesh, Love, Friendship, Motivation
- **Trending Algorithm**: "Trending for Today" section
- **Responsive Grid**: 4/3/2/1 column layouts
- **Live Preview Overlay**: Real-time name + photo preview
- **Premium Gating**: Free opens editor, Premium triggers upsell

### 3. Canvas Personalization Studio
- **Real-time Rendering**: Instant canvas updates
- **Layered Composition**: Background, banner, typography, profile ring
- **Customization**: Name, photo, font size, ring color (Emerald/Violet/Rose/Blue)
- **Export**: PNG download + Web Share API with fallback

### 4. Premium Monetization
- **3-Tier Subscription**: Basic ₹49, Standard ₹99, Pro ₹199
- **Glassmorphism Upsell Modal**

### 5. Admin Panel
- **Dashboard**: Views, shares, downloads, users, templates stats
- **Template Manager**: Full CRUD (add, edit, delete templates)
- **User Management**: View all users/guests
- **Analytics**: Category breakdown, top templates, daily activity
- **Protected Routes**: Role-based adminOnly middleware

### 6. Design System
- **Vibrant Purple-Pink Palette**:
  - Primary: #7C3AED (Violet)
  - Accent: #F472B6 (Pink)
  - Background: #FFFDFE
  - Surface: #F8F5FF
- **Typography**: Poppins + Plus Jakarta Sans
- **Animation**: Framer Motion
- **Responsive**: 375px, 768px, 1280px

---

## Technical Architecture

### Frontend
| Layer | Technology |
|-------|-----------|
| Build | Vite |
| Framework | React 18 |
| Routing | React Router v6 |
| State | Context API + Hooks |
| Styling | CSS Variables + Modules |
| Animation | Framer Motion |
| HTTP | Axios |
| Canvas | HTML5 Canvas API |
| Charts | Recharts |
| Auth | @react-oauth/google |
| Toast | React Hot Toast |

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Bcrypt |
| Uploads | Multer |
| Analytics | MongoDB Aggregation |

### Data Models
- **User**: identity, auth, subscription, admin flag, guest flag
- **Template**: categories, metadata, premium flag, view/share/download counts
- **Subscription**: plan, price, dates, status
- **Analytics**: action tracking (view, share, download, edit, click_premium)

---

## Admin Features

### Dashboard
- Total Views, Shares, Downloads counters
- Total Users, Guests, Templates counters
- Top 5 Templates table
- Category breakdown with progress bars
- Daily activity charts (last 7 days)

### Template Manager
- View all templates in sortable table
- Add new template with form
- Edit existing template inline
- Delete template with confirmation
- View counts per template

### User Management
- View all registered users and guests
- User type badges (Admin, User, Guest)
- Profile pictures displayed
- Join date tracking

### Analytics Tracking
Every user action tracked:
- **View**: Template detail page load
- **Share**: Share button click
- **Download**: Download button click
- **Edit**: Editor opened
- **Click Premium**: Premium template clicked

---

## Quality Assurance

- ✅ Every button functional
- ✅ All page transitions animated
- ✅ Mobile-first responsive
- ✅ Real-time canvas preview
- ✅ Share produces downloadable image
- ✅ Premium popup works correctly
- ✅ Guest login persists across refresh
- ✅ Profile picture reflects immediately
- ✅ Error toasts on failed API calls
- ✅ Skeleton loaders on template grid
- ✅ Admin routes protected with role-based middleware
- ✅ Analytics tracked for every user action

---

## Default Admin Credentials
- **Email**: admin@wishcraft.com
- **Password**: admin123

---

**Crafted with precision. Shared with love.**

*WishCraft v2.0.0 — Vibrant Purple Edition*
