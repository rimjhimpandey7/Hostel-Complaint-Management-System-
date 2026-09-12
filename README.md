# 🏢 Hostel Complaint Management System

A full-stack, real-world **Hostel Complaint Management System** web application designed to eliminate paper complaint registers in college hostels. It enables students to register maintenance complaints online with image attachments, track live resolution milestones (`Submitted` -> `Assigned` -> `In Progress` -> `Resolved`), and provides hostel wardens/administrators with powerful tools for complaint assignment, status management, student monitoring, and interactive analytics visualized via **Recharts**.

---

## 🚀 Key Features

### 👨‍🎓 Student Role
- **Account Registration & Security**: Register with Student ID, Room Number, Hostel Block, and bcrypt-hashed passwords.
- **Interactive Overview Dashboard**: Quick-view metrics for total, pending, in-progress, and resolved complaints.
- **Submit Complaint with Multer Upload**: Form supporting title, category selection, priority level (Low, Medium, High, Emergency), detailed description, and image attachments.
- **Live Complaint Tracking**: Step-by-step visual timeline tracking complaint status history and admin remarks.
- **Search & Filtering**: Filter complaint tickets by category, priority, status, or search query.
- **Profile & Security**: Edit contact information and change password anytime.
- **Forgot Password Flow**: Secure password reset via Nodemailer token email link.

### 🛡️ Admin / Warden Role
- **Command Center Dashboard**: Real-time stats cards for Total Students, Total Complaints, Pending, In Progress, Resolved, and Emergency tickets.
- **Interactive Recharts Analytics**:
  - *Chart 1*: Complaints by Category (Pie Chart)
  - *Chart 2*: Complaints by Status (Donut Chart)
  - *Chart 3*: Complaints by Priority (Bar Chart)
  - *Chart 4*: Complaints Submissions Over Time (Line Chart)
- **Complaint Ticket Actions**:
  - Modal to update status (Pending, Assigned, In Progress, Resolved, Rejected) with custom remarks.
  - Modal to assign staff or department (e.g. Electrician, Plumber, IT Helpdesk).
  - Delete inappropriate or invalid complaint records.
- **Student Account Management**: View all registered students, total complaint count per resident, search, and manage accounts.

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Frontend** | React 18, JavaScript (ES6+), HTML5, CSS3, Bootstrap 5, Bootstrap Icons, Axios, React Router DOM v6, Recharts |
| **Backend** | Node.js, Express.js, JWT Authentication (`jsonwebtoken`), `bcryptjs`, Multer (File Uploads), Nodemailer (Transactional Emails) |
| **Database** | PostgreSQL (Relational schema, Foreign Keys, Indexes, Triggers, Auto-timestamps) |
| **Tools** | VS Code, Git/GitHub, Postman, pgAdmin |

---

## 📁 Project Folder Structure

```
Hostel Complaint Management System/
├── database/
│   ├── schema.sql                     # PostgreSQL table definitions & triggers
│   └── seed.sql                       # Sample seed data for Admin, Students, Complaints
│
├── backend/
│   ├── config/
│   │   ├── db.js                      # PostgreSQL pool connector
│   │   └── email.js                   # Nodemailer transporter & HTML email templates
│   ├── controllers/
│   │   ├── authController.js          # Authentication logic
│   │   ├── userController.js          # Profile management
│   │   ├── complaintController.js     # Student complaint CRUD & timeline
│   │   └── adminController.js         # Admin master controls & analytics
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT verification guard
│   │   ├── roleMiddleware.js          # Role-based authorization
│   │   ├── uploadMiddleware.js        # Multer image file filter & storage
│   │   └── errorHandler.js            # Standardized API error responses
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                       # Multer image storage directory
│   ├── server.js                      # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/                # Recharts Category, Status, Priority, Timeline charts
│   │   │   ├── common/                # Navbar, Sidebar, Footer, Timeline, Badges, ProtectedRoute
│   │   │   └── modals/                # StatusUpdateModal, AssignModal, DeleteModal
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Authentication state context
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── StudentLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── public/                # Home, Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── student/               # StudentDashboard, SubmitComplaint, MyComplaints, ComplaintDetails, Profile, ChangePassword
│   │   │   └── admin/                 # AdminDashboard, AllComplaints, AdminComplaintDetails, ManageStudents, Analytics, AdminProfile
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with auth interceptors
│   │   ├── App.jsx                    # React Router configuration
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Custom design system & Bootstrap overrides
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── postman/
│   └── Hostel_Complaint_API.postman_collection.json
├── README.md
└── .gitignore
```

---

## 🗄️ Database Setup (PostgreSQL)

1. Open **pgAdmin** or PostgreSQL terminal (`psql`).
2. Create a new database named `hostel_complaint_db`:
   ```sql
   CREATE DATABASE hostel_complaint_db;
   ```
3. Run `database/schema.sql` to generate tables:
   ```bash
   psql -U postgres -d hostel_complaint_db -f database/schema.sql
   ```
4. Run `database/seed.sql` to populate initial demo data:
   ```bash
   psql -U postgres -d hostel_complaint_db -f database/seed.sql
   ```

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hostel.com` | `password123` | Chief Hostel Warden |
| **Student** | `rahul.sharma@student.com` | `password123` | Room B-204 (Boys Hostel) |
| **Student** | `ananya.patel@student.com` | `password123` | Room A-108 (Girls Hostel) |

---

## ⚙️ Environment Variables Setup

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hostel_complaint_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=super_secret_hostel_jwt_key_2026_production

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Hostel Admin <no-reply@hostel.com>"

FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 How to Run the Application

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend app runs on `http://localhost:5173`*

---

## 📮 API Documentation & Postman Collection

Import `postman/Hostel_Complaint_API.postman_collection.json` into **Postman**.

### Authentication Endpoints
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login (Returns JWT token)
- `POST /api/auth/forgot-password` - Request reset link
- `POST /api/auth/reset-password` - Reset password with token

### Student Endpoints
- `GET /api/users/profile` - Fetch profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `POST /api/complaints` - Submit complaint (Multer multipart image)
- `GET /api/complaints/my` - List student's complaints
- `GET /api/complaints/:id` - Fetch complaint detail & timeline history

### Admin Endpoints (Requires `role: 'admin'`)
- `GET /api/admin/complaints` - View all complaints (Search & Filter)
- `PUT /api/admin/complaints/:id/status` - Update status & remarks
- `PUT /api/admin/complaints/:id/assign` - Assign staff / department
- `DELETE /api/admin/complaints/:id` - Delete ticket
- `GET /api/admin/students` - View all registered students
- `DELETE /api/admin/students/:id` - Remove student account
- `GET /api/admin/analytics` - Recharts analytics data payload

> **How to authorize in Postman**: Include `Authorization: Bearer <YOUR_JWT_TOKEN>` in the headers of protected endpoints.

---

## 🔮 Future Improvements
1. **SMS Notification Integration**: Send instant SMS alerts via Twilio/Fast2SMS.
2. **Student Feedback & Rating**: Allow students to rate staff service after complaint resolution.
3. **PWA Mobile App Support**: Enable offline reporting and push notifications.

---

## 👨‍💻 Author
**Developed for Hostel Management & Resident Welfare**
- **Technology**: React.js, Express.js, PostgreSQL, Bootstrap 5, Recharts, JWT.
