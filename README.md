# Furniture E-Commerce Website

A full-stack furniture e-commerce platform built with Django REST Framework and React, featuring product browsing, shopping cart functionality, order management, and user authentication.

## 🚀 Features

### Backend (Django REST Framework)
- **User Authentication**: JWT-based authentication system with registration, login, and password reset
- **Product Management**: Complete CRUD operations for furniture products
- **Category System**: Organized product categorization and filtering
- **Shopping Cart**: Session-based and user-specific cart management
- **Order Processing**: Full order lifecycle management with tracking
- **Admin Panel**: Django admin interface for content management
- **RESTful API**: Well-structured API endpoints with proper serialization
- **CORS Support**: Configured for frontend-backend communication

### Frontend (React + Vite)
- **Modern UI**: Responsive design with React components
- **Product Catalog**: Browse and filter furniture products
- **Shopping Experience**: Add to cart, checkout, and order tracking
- **User Dashboard**: Profile management and order history
- **Authentication Flow**: Login, registration, and password recovery
- **State Management**: Redux for application state
- **Routing**: React Router for navigation

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.x
- **API**: Django REST Framework 3.14+
- **Authentication**: djangorestframework-simplejwt 5.3+
- **CORS**: django-cors-headers 4.3+
- **API Documentation**: drf-yasg 1.21+
- **Configuration**: python-decouple 3.8+
- **Database**: SQLite (Development) / PostgreSQL (Production Ready)

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Redux
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: CSS Modules

## 📋 Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn
- Git

## 🔧 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend/furniture_web
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Environment Configuration**
   
   Create a `.env` file in `backend/furniture_web/` directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/furniture-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in `frontend/furniture-website/` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
furniture_website/
├── backend/
│   └── furniture_web/
│       ├── accounts/              # User authentication & management
│       ├── shop/                  # E-commerce functionality
│       │   ├── api/              # API endpoints
│       │   │   ├── cart.py       # Cart operations
│       │   │   ├── categories.py # Category endpoints
│       │   │   ├── orders.py     # Order management
│       │   │   └── products.py   # Product endpoints
│       │   ├── models/           # Database models
│       │   ├── serializers/      # DRF serializers
│       │   └── utils.py          # Utility functions
│       ├── furniture_web/        # Project settings
│       ├── media/                # Uploaded media files
│       ├── staticfiles/          # Static files
│       ├── manage.py
│       ├── requirements.txt
│       └── Dockerfile
└── frontend/
    └── furniture-website/
        ├── src/
        │   ├── components/       # React components
        │   │   ├── atoms/       # Basic components
        │   │   ├── molecules/   # Composite components
        │   │   └── organisms/   # Complex components
        │   ├── pages/           # Page components
        │   ├── services/        # API services
        │   ├── store/           # Redux store
        │   ├── hooks/           # Custom hooks
        │   ├── config/          # Configuration files
        │   └── utils/           # Utility functions
        ├── public/              # Static assets
        ├── package.json
        ├── vite.config.js
        └── Dockerfile
```

## 🔑 API Endpoints

### Authentication
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/token/refresh/` - Refresh JWT token
- `POST /api/accounts/logout/` - User logout

### Products
- `GET /api/shop/products/` - List all products
- `GET /api/shop/products/{id}/` - Get product details
- `GET /api/shop/categories/` - List categories

### Cart
- `GET /api/shop/cart/` - Get user's cart
- `POST /api/shop/cart/add/` - Add item to cart
- `PUT /api/shop/cart/update/{id}/` - Update cart item
- `DELETE /api/shop/cart/remove/{id}/` - Remove item from cart

### Orders
- `GET /api/shop/orders/` - List user orders
- `POST /api/shop/orders/create/` - Create new order
- `GET /api/shop/orders/{id}/` - Get order details

## 🐳 Docker Support

Both backend and frontend include Dockerfile configurations for containerization.

### Running with Docker

**Backend:**
```bash
cd backend/furniture_web
docker build -t furniture-backend .
docker run -p 8000:8000 furniture-backend
```

**Frontend:**
```bash
cd frontend/furniture-website
docker build -t furniture-frontend .
docker run -p 80:80 furniture-frontend
```

## 🧪 Testing

### Backend Tests
```bash
cd backend/furniture_web
python manage.py test
```

### Frontend Tests
```bash
cd frontend/furniture-website
npm run test
```

## 📝 Development

### Backend Development
- API documentation available at `/swagger/` and `/redoc/`
- Admin panel available at `/admin/`
- Use Django management commands for database operations

### Frontend Development
- Hot reload enabled in development mode
- Component development with atomic design principles
- Redux DevTools for state debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of an internship program.

## 👥 Authors

- Abdul Ahad - Furniture Website Project

## 🙏 Acknowledgments

- Django REST Framework documentation
- React and Vite communities
- All contributors and mentors
