# 🛍️ ShopMart — E-Commerce Final Project

A full-featured e-commerce application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and the **RouteAcademy E-Commerce API**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Features Implemented

### 🔐 Authentication
- [x] Login
- [x] Register
- [x] Forgot Password (3-step: email → verify code → reset)
- [x] Change Password (in Profile)
- [x] Protected Routes with JWT Cookies

### 🏠 Pages
- [x] Homepage with Hero Slider, Categories, Featured Products, Brands
- [x] Products Listing with Filters (Category, Brand, Price Range), Sort, Pagination
- [x] Product Details with image gallery, rating, related products
- [x] Brands Listing + Brand Details with products
- [x] Categories Listing + Category Details with subcategory filter
- [x] Cart (Display, Add, Remove, Update quantity)
- [x] Wishlist (Display, Add, Remove)
- [x] Checkout (Cash on Delivery + Online Payment via Stripe)
- [x] Orders History
- [x] Profile (Account Info, Change Password, Manage Addresses)
- [x] 404 Not Found

### 🛒 Cart Operations
- [x] Add to cart
- [x] Remove from cart
- [x] Update quantity
- [x] Clear entire cart
- [x] Persistent via Context API

### ❤️ Wishlist Operations
- [x] Add to wishlist
- [x] Remove from wishlist
- [x] Toggle heart icon on product cards

### 💳 Payment
- [x] Cash on Delivery
- [x] Online Payment (Stripe via API)

### 📦 Orders
- [x] View all user orders
- [x] Order status (Paid/Pending, Delivered/In Transit)

### 📍 Address Management
- [x] Add address
- [x] Remove address
- [x] Used in checkout

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| **Next.js 14** | Framework (App Router) |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Sass** | Global styles |
| **React Hook Form** | Form validation |
| **Axios** | API calls |
| **js-cookie** | JWT storage |
| **react-hot-toast** | Notifications |
| **Context API** | State management (Auth, Cart, Wishlist) |

---

## 📁 Project Structure

```
app/
├── auth/
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── products/
│   └── [id]/
├── brands/
│   └── [id]/
├── categories/
│   └── [id]/
├── cart/
├── wishlist/
├── checkout/
├── orders/
├── profile/
├── layout.tsx
├── page.tsx
└── not-found.tsx

components/
├── layout/      → Navbar, Footer
├── home/        → HeroSection, CategoriesSection, FeaturedProducts, BrandsSection, PromoSection
├── product/     → ProductCard
└── common/      → Skeletons

context/
├── AuthContext.tsx
├── CartContext.tsx
└── WishlistContext.tsx

lib/
└── axios.ts     → Axios instance with auth interceptors

types/
└── index.ts     → All TypeScript interfaces
```

---

## 🔗 API Base URL
```
https://ecommerce.routemisr.com/api/v1
```

---

## 👨‍💻 Demo Credentials (if needed)
Create a new account via the Register page.
