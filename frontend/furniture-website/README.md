# 🌐 Furniture Shopping Website (Frontend)

Frontend for a furniture shopping platform built with **React**, **Vite**, **Redux**, **Tailwind CSS**, fully **dockerized** using **Docker Compose**.

---

## 🚀 Project Overview

This frontend allows users to:

* Browse product categories and listings
* View product details with variants
* Add, update, or remove products in the cart
* Checkout as guest or logged-in user
* Track orders using a tracking ID
* User authentication: signup, login, logout, password reset, email verification
* Currency selection and cart toggle

---

## 📁 Project Structure

```
src/
├── App.jsx                 # Main app with routing and hydration
├── index.jsx               # Entry point, ReactDOM render
├── store/                  # Redux slices and store setup
│   ├── cartSlice.js
│   ├── userSlice.js
│   ├── globalSlice.js
│   └── index.js
├── services/               # API services
│   ├── api.js              # Generic HTTP methods
│   ├── authAPI.js
│   ├── cartAPI.js
│   ├── ordersAPI.js
│   ├── productAPI.js
│   └── collectionsAPI.js
├── templates/              # Layout components
├── pages/                  # All pages (Home, Product, Auth, Checkout)
├── components/             # Reusable components (Input, AuthForm, ScrollToTop, etc.)
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions (localStorage, slugify, formatPrice)
├── config/                 # Config files (currencies, exchange rates)
└── index.css               # Global Tailwind CSS
```

---

## ⚙️ Installation

### Prerequisites

* Node.js 20+
* npm or yarn
* Docker (optional, recommended)

### Local Setup

1. Clone the repo:

```bash
git clone <repo-url>
cd furniture-shopping
```

2. Install dependencies:

```bash
npm install
# or
# yarn install
```

3. Create `.env` file with API base URL:

```
VITE_API_BASE_URL=http://localhost:5000
```

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
npm run preview
```

---

### Docker Setup (Recommended)

1. Build and run container using Docker Compose:

```bash
docker compose up --build
```

2. Access frontend at: `http://localhost:5173`

---

## 🧪 Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start development server       |
| `npm run build`    | Build production bundle        |
| `npm run preview`  | Preview production build       |
| `npm run lint`     | Run ESLint                     |
| `npm run format`   | Format code using Prettier     |
| `npm run test`     | Run tests with Vitest          |
| `npm run coverage` | Run tests with coverage report |

---

## 🔗 API Endpoints & Data

> All API requests are sent to `VITE_API_BASE_URL/api`.

### 1️⃣ Authentication (`/auth`)

| Endpoint                | Method | Body / Params                   | Response            |
| ----------------------- | ------ | ------------------------------- | ------------------- |
| `/signup`               | POST   | `{ username, email, password }` | `{ message, user }` |
| `/login`                | POST   | `{ email, password }`           | `{ message, user }` |
| `/logout`               | POST   | -                               | `{ message }`       |
| `/me`                   | GET    | -                               | `{ user }`          |
| `/send-verify-email`    | POST   | `{ email }`                     | `{ message }`       |
| `/request-password-set` | POST   | `{ email }`                     | `{ message }`       |
| `/reset-password`       | POST   | `{ email, token, password }`    | `{ message }`       |

### 2️⃣ Cart (`/cart`) [Auth required]

| Endpoint | Method | Body       | Response            |
| -------- | ------ | ---------- | ------------------- |
| `/`      | GET    | -          | `{ cart }`          |
| `/`      | PUT    | `{ cart }` | `{ success: true }` |
| `/`      | DELETE | -          | `{ success: true }` |

**Cart structure**

```json
{
  "productId": {
    "productId": 1,
    "variantId": 2,
    "title": "Chair",
    "variantTitle": "Black",
    "price": 5000,
    "quantity": 1
  }
}
```

### 3️⃣ Orders (`/orders`)

| Endpoint                   | Method | Body                                 | Response                                                                               |
| -------------------------- | ------ | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `/place-order`             | POST   | Order payload (shipping info + cart) | `{ message, order }`                                                                   |
| `/track-order/:trackingId` | GET    | -                                    | `{ trackingId, status, estimatedDelivery, products, shippingAddress, billingAddress }` |

### 4️⃣ Products (`/products`)

| Endpoint                  | Method | Query/Params          | Response                   |
| ------------------------- | ------ | --------------------- | -------------------------- |
| `/`                       | GET    | Optional query params | `{ products }`             |
| `/category/:categoryName` | GET    | Pagination params     | `{ products, pagination }` |
| `/:productId`             | GET    | -                     | `{ product }`              |

### 5️⃣ Categories (`/categories`)

| Endpoint | Method | Response         |
| -------- | ------ | ---------------- |
| `/`      | GET    | `{ categories }` |

---

## 🛠 Redux Store

### Slices

* **userSlice** → handles authentication state (`userInfo`, `isLoggedIn`, `loading`, `error`)
* **cartSlice** → handles cart state (`store`, `totalItems`) and syncs with localStorage and backend
* **globalSlice** → global state (`currency`, `cartOpen`)

**Cart listener** automatically saves cart to localStorage and syncs with backend if logged in.

---

## 🔧 Utilities

* **localStorage** helpers: `loadCart`, `saveCart`
* **Price & currency**: `formatPrice`, `convertPrice`
* **Slugify**: `slugify(title)` → URL-friendly string
* **Debounce**: `rebounce(fn, delay)`

---

## 🎨 Styling

* Tailwind CSS with JIT mode
* Global CSS imported in `index.css`
* Component-level utility classes used

---

## 🧪 Testing

* Vitest used for unit and component tests
* Jest DOM for DOM assertions
* Run tests:

```bash
npm run test
npm run coverage
```

---

## 📦 Docker Setup

**Dockerfile** builds production bundle and serves via **Nginx**:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**

```yaml
version: '3.9'
services:
  frontend:
    container_name: myapp-frontend
    build: .
    ports:
      - '5173:80'
    restart: unless-stopped
    environment:
      NODE_ENV: production
```

---

## 💻 How to Contribute

1. Fork the repo
2. Create a branch `feature/your-feature`
3. Install dependencies and run locally
4. Make changes and commit with ESLint + Prettier formatting
5. Push branch and create a pull request

---

## 👨‍💻 Author

**Tahsin Haider**
