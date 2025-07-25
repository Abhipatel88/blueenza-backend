# Blueneza Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
- JWT_SECRET: Your JWT secret key
- EMAIL_USER: Your Gmail address
- EMAIL_PASS: Your Gmail app password
- ADMIN_EMAIL: Email to receive form submissions

3. Start MongoDB locally

4. Create initial admin:
```bash
POST /api/auth/create-admin
{
  "email": "admin@blueneza.com",
  "password": "your_password"
}
```

5. Start server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Admin login
- POST `/api/auth/logout` - Admin logout
- POST `/api/auth/create-admin` - Create admin

### Dashboard (Protected)
- GET `/api/dashboard/stats` - Get dashboard statistics
- GET `/api/dashboard/quotes` - Get all quotes
- GET `/api/dashboard/contacts` - Get all contacts
- PATCH `/api/dashboard/quotes/:id/status` - Update quote status
- PATCH `/api/dashboard/contacts/:id/status` - Update contact status

### Forms (Public)
- POST `/api/forms/quote` - Submit quote request
- POST `/api/forms/contact` - Submit contact message#   b l u e e n z a - b a c k e n d  
 