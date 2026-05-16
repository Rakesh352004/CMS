# Complaint Management System (CMS)

A full-stack web application for managing complaints with email notifications and dark/light theme support.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Complaint Management**: Submit, track, and manage complaints
- **Admin Panel**: Administrative dashboard for managing users and complaints
- **Email Notifications**: Automatic email notifications for complaint submissions and resolutions
- **Gmail Validation**: Ensures users register with valid Gmail addresses
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live complaint status tracking

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Toastify for notifications
- CSS for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email services
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account with 2-factor authentication enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raghu-K10/complaint-management-system.git
   cd complaint-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/complaintDB
   PORT=5000
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Set up Gmail App Password**

   a. Enable 2-factor authentication on your Gmail account
   b. Go to Google Account settings → Security → App passwords
   c. Generate an app password for "CMS Portal"
   d. Use this app password in the EMAIL_PASS field

## Running the Application

1. **Start MongoDB** (make sure MongoDB is running on your system)

2. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on http://localhost:5000

3. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

## Usage

### User Registration/Login
- Register with a valid Gmail address
- Login with your credentials

### Submitting Complaints
- Navigate to the Submit Complaint page
- Fill in the complaint details
- Receive email confirmation upon submission

### Tracking Complaints
- View all your submitted complaints
- Track status updates in real-time

### Admin Features
- Access admin panel (admin role required)
- Manage user accounts
- Update complaint statuses
- Send resolution emails automatically

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Complaints
- `POST /api/complaints/create` - Create new complaint
- `GET /api/complaints/my` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (admin only)
- `PUT /api/complaints/update/:id` - Update complaint status (admin only)

## Project Structure

```
complaint-management-system/
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── complaint.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── context/
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Admin.js
│   │   │   ├── Profile.js
│   │   │   ├── SubmitComplaint.js
│   │   │   └── TrackComplaint.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Node.js
- Email service powered by Nodemailer
- Database: MongoDB
- UI Design inspired by modern web applications
