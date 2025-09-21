# Pixisphere Backend

Pixisphere is a full-stack AI-powered photography service marketplace that connects clients with verified photographers and studios across India.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Contributing](#contributing)

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Multi-role System**: Support for clients, partners (photographers), and admins
- **Partner Onboarding**: Complete photographer verification and onboarding process
- **Portfolio Management**: Photographers can manage their portfolio with image uploads
- **Inquiry System**: Clients can submit photography service inquiries
- **Admin Dashboard**: Admin panel for managing categories, locations, and partner verifications
- **Location & Category Management**: Dynamic management of service categories and locations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Environment Management**: dotenv
- **CORS**: Cross-Origin Resource Sharing enabled

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pushsontakke/pixisphere-backend.git
   cd pixisphere-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Setup

1. **Create environment file**

   ```bash
   cp .env.example .env
   ```

   Or create a `.env` file in the root directory with the following variables:

   ```env
   # Database Configuration
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/pixisphere?retryWrites=true&w=majority

   # Server Configuration
   PORT=8000

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=3d

   # OTP Configuration (for development)
   OTP_CODE=123456
   ```

2. **Configure MongoDB**
   - For local MongoDB: `mongodb://localhost:27017/pixisphere`
   - For MongoDB Atlas: Use the connection string from your Atlas cluster

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8000).

You should see:

```
MongoDB Connected: your-cluster-host
server is running on port: 8000
```

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Partner Endpoints (Protected)

- `POST /api/partner/onboard` - Submit partner onboarding
- `POST /api/partner/portfolio` - Add portfolio item
- `GET /api/partner/portfolio` - Get partner's portfolio
- `PUT /api/partner/portfolio/:itemId` - Edit portfolio item
- `DELETE /api/partner/portfolio/:itemId` - Delete portfolio item
- `PUT /api/partner/portfolio/reorder` - Reorder portfolio items

### Admin Endpoints (Protected)

- `GET /api/admin/verifications` - Get pending partner verifications
- `PUT /api/admin/verifications/:id` - Verify/reject partner
- `GET /api/admin/stats` - Get admin statistics
- `POST /api/admin/categories` - Create category
- `GET /api/admin/categories` - Get all categories
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `POST /api/admin/locations` - Create location
- `GET /api/admin/locations` - Get all locations
- `PUT /api/admin/locations/:id` - Update location
- `DELETE /api/admin/locations/:id` - Delete location

### Inquiry Endpoints (Protected)

- `POST /api/` - Submit inquiry (clients only)
- `GET /api/partner/leads` - Get partner leads (partners only)

## Project Structure

```
pixisphere-backend/
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   ├── adminController.js    # Admin-related business logic
│   ├── authControllers.js    # Authentication logic
│   ├── inquiryController.js  # Inquiry management
│   ├── partnerController.js  # Partner onboarding
│   └── portfolioController.js # Portfolio management
├── middlewares/
│   └── authMiddlewares.js    # Authentication & authorization middleware
├── models/
│   ├── Category.js           # Category model
│   ├── Inquiry.js           # Inquiry model
│   ├── Location.js          # Location model
│   ├── PartnerProfile.js    # Partner profile model
│   └── User.js              # User model
├── routes/
│   ├── admin.js             # Admin routes
│   ├── auth.js              # Authentication routes
│   ├── inquiry.js           # Inquiry routes
│   └── partner.js           # Partner routes
├── utils/
│   └── jwtUtils.js          # JWT utility functions
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── index.js                # Application entry point
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Database Models

### User Model

- Email-based authentication
- Role-based access (client, partner, admin)
- Password hashing with bcrypt
- Verification status tracking

### Partner Profile Model

- Personal details (name, phone, address)
- Service details (categories, locations, experience)
- Document metadata (Aadhar number)
- Portfolio with image URLs and descriptions
- Verification state management

### Inquiry Model

- Client inquiry details
- Category and location-based matching
- Budget and date requirements
- Status tracking (new, responded, booked, closed)
- Partner assignment system

## Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run linting (if configured)
npm run lint

# Run tests (placeholder)
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Piyush Sontakke**

- GitHub: [@pushsontakke](https://github.com/pushsontakke)

## Support

For support, please open an issue on the [GitHub repository](https://github.com/pushsontakke/pixisphere-backend/issues).
