# IRCTC Booking - Train Ticket Reservation System

A simulated web application for train ticket booking built with React.js and Tailwind CSS. This is a frontend-only application that uses localStorage for data persistence.

## Features

- ✅ **User Authentication**: Signup and Login functionality
- ✅ **User Profile**: Manage personal information
- ✅ **Payment Methods**: Add and manage debit cards, credit cards, and UPI
- ✅ **Passenger Master List**: Save frequent passengers for quick booking
- ✅ **Train Search**: Search trains by source, destination, and date
- ✅ **Availability Check**: Check seat availability by class and quota
- ✅ **Booking**: Complete booking flow with passenger details and payment
- ✅ **My Bookings**: View all bookings and cancel tickets
- ✅ **Mock Payment Gateway**: Simulated payment processing
- ✅ **Admin Dashboard**: Comprehensive admin panel for managing users, bookings, and trains

## Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **localStorage** - Data persistence (no backend required)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation bar component
├── pages/
│   ├── Home.jsx            # Home page
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Signup page
│   ├── Profile.jsx         # User profile page
│   ├── PaymentMethods.jsx  # Payment methods management
│   ├── PassengerMaster.jsx # Passenger master list
│   ├── TrainSearch.jsx     # Train search page
│   ├── TrainAvailability.jsx # Availability check page
│   ├── Booking.jsx         # Booking page
│   ├── MyBookings.jsx      # My bookings page
│   ├── AdminDashboard.jsx  # Admin dashboard page
│   └── ProtectedRoute.jsx  # Protected route component
├── App.jsx                 # Main app component with routing
├── main.jsx                # Entry point
└── index.css               # Global styles with Tailwind
```

## Usage

1. **Sign Up**: Create a new account or login with existing credentials
2. **Add Payment Methods**: Go to Payment Methods and add your cards/UPI
3. **Add Passengers**: Save frequent passengers in Passenger Master List
4. **Search Trains**: Enter source, destination, and date to search trains
5. **Check Availability**: Select class and quota to check seat availability
6. **Book Ticket**: Add passenger details and complete payment
7. **View Bookings**: Check all your bookings in My Bookings
8. **Cancel Booking**: Cancel any confirmed booking from My Bookings

### Admin Access

1. **Admin Login**: Use the admin credentials to access the admin dashboard
   - Email: `admin@irctc.com`
   - Password: `admin123`
2. **Admin Dashboard Features**:
   - View statistics (total users, bookings, revenue)
   - Manage users (view and delete users)
   - Manage bookings (view all bookings, cancel bookings)
   - Manage trains (add, edit, delete trains)

## Data Storage

All data is stored in browser's localStorage:
- User accounts: `users`
- Current user: `currentUser`
- Payment methods: `paymentMethods_{userId}`
- Passengers: `passengers_{userId}`
- Bookings: `bookings_{userId}`
- Trains: `trains` (admin-managed)

## Notes

- This is a frontend-only application with no backend
- All data is stored locally in the browser
- Payment processing is simulated (no real transactions)
- Train data is mock data for demonstration purposes
- Clear browser data to reset the application

## Available Stations (Mock Data)

- Delhi
- Mumbai
- Kolkata
- Chennai
- Bangalore
- Hyderabad
- Pune
- Ahmedabad

## License

This project is for educational/demonstration purposes only.


