WealthWave – Smart Personal Finance Manager
Overview

WealthWave is a modern full-stack personal finance management web application designed to help users manage money in a smart, simple, and visual way.

The platform allows users to:

Track income and expenses
Manage monthly budgets
Visualize financial insights using charts
Create recurring transactions
Export financial reports
Receive smart notifications
Get AI-based financial suggestions

The project focuses on providing a clean and user-friendly experience for understanding and improving personal financial habits.

Problem Statement

Many people still manage their finances using notebooks, memory, or spreadsheets, which often leads to:

Unstructured expense tracking
Missing financial records
Overspending without awareness
Difficulty analyzing raw financial data
Lack of visual insights
Excessive manual calculations

WealthWave solves these issues by offering a centralized platform to record, monitor, and analyze financial activities efficiently.

Objectives

The main objectives of this project are:

Build a secure finance management platform
Simplify income and expense tracking
Help users control spending through budgeting
Provide visual financial analytics
Support recurring financial activities
Generate downloadable reports
Improve financial awareness using AI assistance
Target Users
Students
Working professionals
Beginners in personal finance
Individuals managing monthly budgets
Tech Stack
Technology	Usage
React + Vite	Frontend
Node.js + Express	Backend API
MongoDB	Database
JWT + bcrypt	Authentication & Security
Chart.js	Data Visualization
System Architecture
Frontend (React + Vite)
        ↓
Backend API (Node.js + Express)
        ↓
Database (MongoDB)
Features
Authentication System
User Signup
User Login
JWT-based Authentication
Password Encryption using bcrypt
Validation System

Frontend and backend validation included:

Only @gmail.com email addresses allowed
Password must contain:
Minimum 8 characters
Uppercase letter
Lowercase letter
Number
Special character
Dashboard Analytics
Total Balance
Total Income
Total Expenses
Savings Rate
Recent Transactions
Transaction Management
Add Income
Add Expense
Category Support
Date Support
Notes Support
Delete Transactions
Budget Management
Set Monthly Budgets
Track Spending
Remaining Balance Tracking
Over-budget Alerts
Reports & Analytics
Category-wise Expense Charts
Monthly Spending Trends
Income vs Expense Analysis
Recurring Transactions
Create Recurring Plans
Auto-generate Transactions
Export System
Export Transactions as CSV
Export Financial Summary as PDF
Notification System
Budget Alerts
Recurring Transaction Notifications
AI Assistant
Finance-related Question Answering
Local Insight Mode
Optional OpenAI Integration Support
Modules Implemented
Module	Status
Authentication	✅ Completed
Validation	✅ Completed
Dashboard	✅ Completed
Transactions	✅ Completed
Budgets	✅ Completed
Reports	✅ Completed
Recurring Transactions	✅ Completed
CSV Export	✅ Completed
PDF Export	✅ Completed
Notifications	✅ Completed
AI Assistant	✅ Completed
Project Screens

The application includes:

Login Page
Signup Page
Dashboard
Transaction Section
Budget Section
Reports & Charts
Notifications Section
Recurring Transactions
AI Assistant Interface
Installation & Setup
1. Clone Repository
git clone https://github.com/harshXranger/Finance-Managment.git

cd Finance-Managment
Backend Setup
Step 1: Navigate to Server Folder
cd server
Step 2: Create .env File

Create a .env file using .env.example

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wealthwave
JWT_SECRET=wealthwave-local-dev-secret
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=
Step 3: Install Dependencies
npm install
Step 4: Run Backend
npm run dev

Backend runs on:

http://localhost:5000

Health Check:

http://localhost:5000/api/health

Note:
If http://localhost:5000/ shows Route not found: /, that is expected because the backend is an API server.

Frontend Setup
Step 1: Navigate to Client Folder
cd client
Step 2: Create .env File
VITE_API_URL=http://localhost:5000/api
Step 3: Install Dependencies
npm install
Step 4: Run Frontend
npm run dev

Frontend runs on:

http://localhost:5173
Database Information
Database Name
wealthwave
Collections Used
users
transactions
budgets
recurringtransactions
notifications
Checking Database
Using MongoDB Compass
Open MongoDB Compass
Connect to:
mongodb://127.0.0.1:27017
Open database:
wealthwave
Using Mongo Shell
mongosh

use wealthwave

show collections

db.users.find().pretty()

db.transactions.find().pretty()

db.budgets.find().pretty()

db.recurringtransactions.find().pretty()

db.notifications.find().pretty()
API Routes
Authentication
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
Dashboard
GET /api/dashboard/summary
Transactions
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
Budgets
GET  /api/budgets
POST /api/budgets
Reports
GET /api/reports/overview
GET /api/reports/export/transactions.csv
Recurring Transactions
GET  /api/recurring
POST /api/recurring
Notifications
GET   /api/notifications
PATCH /api/notifications/:id/read
AI Assistant
POST /api/assistant/chat
Current Status

The project is currently functional with:

React Frontend
Express Backend
MongoDB Database
Secure Authentication
Dashboard Analytics
Budget Management
Transaction Tracking
Report Generation
CSV/PDF Export
Notifications
AI Assistant
Future Improvements
Edit Transaction UI
Advanced Filters
Better Notification Controls
Admin Dashboard
Unit & Integration Testing
Deployment on Vercel and Render
Full OpenAI Integration
Conclusion

WealthWave is a practical and scalable personal finance management platform that helps users:

Record financial activities
Analyze spending habits
Plan budgets effectively
Visualize financial data
Automate recurring entries
Export reports
Receive AI-driven insights

The project can be further expanded into a complete financial planning ecosystem in the future.

Author

Harsh Singh

Frontend Developer | Full Stack Learner | MERN Stack Enthusiast
