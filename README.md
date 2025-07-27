# StreetFood Vendor App

A comprehensive platform connecting street food vendors with suppliers, built with React.js frontend and Node.js backend.

## Features

### For Vendors
- Browse and search products from multiple suppliers
- Place orders with real-time inventory tracking
- Track order status from placement to delivery
- Manage order history and spending analytics
- Connect with reliable suppliers in your area

### For Suppliers
- List and manage product inventory
- Receive and process orders from vendors
- Update order status and delivery tracking
- Analytics dashboard for sales and revenue
- Build customer relationships

## Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **Lucide React** - Beautiful icons
- **Custom CSS** - Responsive design with modern styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Project Structure

```
streetfood-vendor-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── products/  # Product management
│   │   │   ├── orders/    # Order management
│   │   │   └── common/    # Shared components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state
│   │   └── styles/        # CSS styles
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/streetfood-vendor-app
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (suppliers only)
- `PUT /api/products/:id` - Update product (suppliers only)
- `DELETE /api/products/:id` - Delete product (suppliers only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/vendor` - Get vendor orders
- `GET /api/orders/supplier` - Get supplier orders
- `POST /api/orders` - Create order (vendors only)
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Key Features Implemented

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (vendor/supplier)
- Protected routes and API endpoints
- Persistent login sessions

### Product Management
- CRUD operations for products
- Category-based filtering
- Search functionality
- Stock management
- Supplier-specific product listings

### Order Management
- Complete order lifecycle
- Real-time status updates
- Order history and tracking
- Role-specific order views

### User Interface
- Responsive design for all devices
- Modern, intuitive interface
- Toast notifications for user feedback
- Loading states and error handling
- Beautiful gradient designs and animations

### State Management
- React Context for global state
- Persistent authentication state
- Optimistic UI updates
- Error boundary handling

## Usage

### For Vendors
1. Register as a vendor with your location
2. Browse available products by category
3. Add products to your order
4. Place orders with delivery address
5. Track order status in real-time
6. View order history and analytics

### For Suppliers
1. Register as a supplier with your location
2. Add your products with details and pricing
3. Manage inventory and stock levels
4. Receive and process vendor orders
5. Update order status (pending → processing → shipped → delivered)
6. View sales analytics and revenue

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- CORS configuration
- Environment variable protection

## Future Enhancements
- Real-time notifications
- Payment gateway integration
- GPS-based supplier discovery
- Rating and review system
- Advanced analytics dashboard
- Mobile app development
- Multi-language support

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For support or questions, please contact the development team or create an issue in the repository.