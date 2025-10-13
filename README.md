# 📚 School Management Dashboard

A scalable School Management System built with Next.js that enables admins to manage students, classes, attendance, and subjects seamlessly. This dashboard also supports profile picture uploads using Cloudinary and provides a clean, responsive UI for efficient school data management.

##🚀 Features

Authentication & Admin Dashboard

Secure login with environment-based admin credentials

JWT authentication for API protection

Student Management

Add and update student profiles with photo upload (Cloudinary integration)

Maintain student records across sessions

Class & Subject Management

Create and manage classes for each session

Assign subjects to classes

Attendance Tracking

Mark daily attendance for students

Track class-wise attendance

Scalable Structure

Modular API integration with Next.js API routes

MongoDB database for persistence

Cloudinary for secure file storage

##🛠️ Tech Stack

Frontend & Backend: Next.js (Full-stack)

Database: MongoDB (Mongoose ODM)

Authentication: JWT-based auth

File Uploads: Cloudinary

Styling: Tailwind CSS / ShadCN UI

Password Hashing: bcrypt

##⚙️ Environment Variables

Create a .env.local file in the root directory and configure the following:

ADMIN_PHONENUMBER=1234567890
ADMIN_PASSWORD=password
ADMIN_ID=123123123
ADMIN_NAME=Admin
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_super_secure_secret_key
CLOUDINARY_SECRET=your_cloudinary_secret
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

##▶️ Getting Started

Clone the repository

git clone https://github.com/your-username/school-management-dashboard.git
cd school-management-dashboard

Install dependencies

npm install

# or

yarn install

Setup environment variables
Create a .env.local file and add the required variables (see above).

Run the development server

npm run dev

# or

yarn dev

Open in browser
Visit http://localhost:3000

📂 Project Structure
school-management-dashboard/
│
├── app/ # Next.js app router pages
├── components/ # Reusable UI components
├── lib/ # Utility functions (auth, db, cloudinary, etc.)
├── models/ # Mongoose models (Student, Class, Session, Subject)
├── public/ # Static assets
├── .env.local # Environment variables
└── README.md # Project documentation

📌 API Endpoints
Auth

POST /api/auth/login – Login with admin credentials

Students

POST /api/students – Add a student (with profile pic)

GET /api/students – Fetch all students

PATCH /api/students/:id – Update student details

DELETE /api/students/:id – Remove a student

Classes & Subjects

POST /api/classes – Create a new class for a session

POST /api/subjects – Add subjects to a class

GET /api/classes/:sessionId – Get classes for a session

Attendance

POST /api/attendance – Mark attendance

GET /api/attendance/:classId – Fetch attendance for a class

##🔒 Security & Scalability

Environment variables secured in .env.local

JWT authentication for protected APIs

Modular architecture for scaling with more features (fees, exams, parent portal, etc.)

##📜 License

This project is licensed under the MIT License.
