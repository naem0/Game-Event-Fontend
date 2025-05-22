# Game Tournament Platform

## Short Summary
A comprehensive gaming tournament platform with user authentication, tournament management, balance management, and admin features. Users can join tournaments, win prizes, manage their balance through top-ups and withdrawals, and participate in a referral program. Admins have full control over tournaments, user management, and financial transactions.

## Detailed Description

### Introduction
The Game Tournament Platform is a full-stack web application designed to host and manage gaming tournaments. It provides a complete ecosystem for gamers to participate in tournaments, win prizes, and manage their accounts. The platform includes robust admin features for tournament management, user administration, and financial oversight.

### Key Features

#### User Management
- User registration and authentication with JWT
- User profiles with personal information
- Role-based access control (user and admin roles)
- Profile image upload and management
- Account suspension by admin

#### Tournament System
- Create and manage tournaments with detailed information
- Tournament registration for users
- Different tournament types and categories
- Tournament status management (active, inactive, completed)
- Room ID and password for tournament participants
- Tournament history and statistics

#### Financial System
- Balance management for users
- Top-up system with multiple payment methods
- Withdrawal requests with admin approval
- Prize money distribution
- Minimum withdrawal amount of 100 taka
- Transaction history for admins
- Prize money tracking for users

#### Referral System
- Generate unique referral codes
- Track referrals and referral status
- Earn bonuses when referred users make top-ups
- Pending and confirmed referral earnings

#### Admin Dashboard
- Comprehensive admin controls
- User management with detailed user information
- Tournament management
- Financial oversight (top-ups, withdrawals, prizes)
- Transaction monitoring
- System statistics and reports

### Technology Stack

#### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui components
- NextAuth.js for authentication
- React Hook Form for form handling

#### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcrypt for password hashing

### Getting Started

#### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

#### Environment Variables
Backend (.env):
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/game-tournament
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
\`\`\`

Frontend (.env.local):
\`\`\`
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
\`\`\`

#### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/game-tournament-platform.git
cd game-tournament-platform
\`\`\`

2. Install backend dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

3. Install frontend dependencies
\`\`\`bash
cd ..
npm install
\`\`\`

4. Start the backend server
\`\`\`bash
cd backend
npm run dev
\`\`\`

5. Start the frontend development server
\`\`\`bash
cd ..
npm run dev
\`\`\`

### Project Structure

\`\`\`
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── tournaments/      # Tournament pages
│   └── ...
├── backend/              # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── components/           # React components
│   ├── ui/               # UI components
│   └── ...
├── public/               # Static files
└── utils/                # Frontend utility functions
\`\`\`

### User Features

- Users can see their prize money won but not full transaction history
- Users can only see room ID and password after joining a tournament
- Users cannot withdraw less than 100 taka
- Users earn referral bonuses when referred users make top-ups (not immediately upon registration)

### Admin Features

- Admins can view complete user information including:
  - Transaction history
  - Prize money won
  - Top-up history
  - Referral history
  - Tournament participation
- Admins can suspend users
- Admins can see tournament participants and their information
- Admins can add room ID and password when creating or editing tournaments

### API Endpoints

#### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/me - Get current user

#### Users
- GET /api/users - Get all users (admin)
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- PUT /api/users/:id/promote - Promote user to admin
- PUT /api/users/:id/suspend - Suspend a user

#### Tournaments
- GET /api/tournaments - Get all tournaments
- POST /api/tournaments - Create a tournament (admin)
- GET /api/tournaments/:id - Get tournament by ID
- PUT /api/tournaments/:id - Update tournament (admin)
- POST /api/tournaments/:id/register - Register for a tournament
- GET /api/tournaments/user/registrations - Get user's registered tournaments
- GET /api/tournaments/:id/registrations - Get tournament registrations (admin)

#### Financial
- POST /api/topup - Create a top-up request
- GET /api/topup - Get user's top-up history
- GET /api/topup/admin - Get all top-up requests (admin)
- PUT /api/topup/:id/process - Process a top-up request (admin)
- POST /api/withdraw - Create a withdrawal request
- GET /api/withdraw - Get user's withdrawal history
- GET /api/withdraw/admin - Get all withdrawal requests (admin)
- PUT /api/withdraw/:id/process - Process a withdrawal request (admin)
- GET /api/transactions - Get transaction history (admin)
- GET /api/prizes - Get user's prize history
- POST /api/prizes - Create a prize request
- GET /api/prizes/admin - Get all prize requests (admin)
- PUT /api/prizes/:id/process - Process a prize request (admin)

#### Referrals
- GET /api/referrals/invite - Generate an invite link
- GET /api/referrals/stats - Get referral stats
- POST /api/referrals/process - Process referral registration
- POST /api/referrals/credit - Credit referral bonus (admin)

### Error Handling

The platform implements comprehensive error handling with:
- Consistent API response format with success/error flags
- Detailed error messages for debugging
- User-friendly error messages in the frontend
- Form validation with clear error messages
- Loading states to prevent multiple submissions
\`\`\`

Now, let's update the models and controllers to implement the requested changes:
