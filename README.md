# WealthWave

## Project Title

WealthWave - Smart Personal Finance Manager

## Project Overview

WealthWave is a full-stack web application developed to help users manage personal finances in a smart, simple, and visual way.

The system helps users:

- track income and expenses
- manage monthly budgets
- view spending insights using charts
- create recurring transactions
- export reports
- receive notifications
- get simple AI-based financial suggestions

This project is built for users who want a clean and easy method to understand where their money is going.

## Problem Statement

Many people still manage their finances using notebooks, memory, or Excel sheets.

This creates problems such as:

- unstructured expense tracking
- missing financial records
- overspending without realizing it
- difficulty in understanding raw numbers
- lack of visual reports
- too much manual calculation work

WealthWave solves these problems by giving users one centralized platform to record, monitor, and analyze financial activity.

## Objectives

The main objectives of this project are:

- to build a secure personal finance management system
- to make expense and income tracking simple
- to help users control spending with budget planning
- to provide clear graphical insights
- to support recurring financial activities
- to generate useful reports and exports

## Target Users

- students
- working professionals
- beginners in personal finance

## Technology Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT + bcrypt
- Charts: Chart.js

## System Architecture

```text
Frontend (React)
      ↓
Backend API (Node.js + Express)
      ↓
Database (MongoDB)
```

## Modules Implemented

### 1. Authentication Module

- user signup
- user login
- JWT-based authentication
- password encryption using bcrypt

### 2. Validation Module

Validation added in both frontend and backend:

- only `@gmail.com` email addresses are allowed
- password must be at least 8 characters
- password must include:
  uppercase letter
  lowercase letter
  number
  special character

### 3. Dashboard Module

- total balance
- total income
- total expenses
- savings rate
- recent transactions

### 4. Transaction Module

- add income
- add expense
- category support
- date support
- note support
- delete transaction

### 5. Budget Module

- set monthly budgets
- track amount spent
- show remaining amount
- show over-budget warning

### 6. Reporting Module

- category-wise expense chart
- monthly trend chart
- income vs expense chart

### 7. Recurring Transaction Module

- create recurring plans
- auto-generate transactions from recurring entries

### 8. Export Module

- export transactions as CSV
- export summary as PDF

### 9. Notification Module

- budget alert notifications
- recurring transaction update notifications

### 10. AI Assistant Module

- answer finance-related questions
- local insight mode available without API key
- optional OpenAI-based response support

## Features Completed So Far

- secure login and signup
- Gmail-only email validation
- strong password validation
- transaction management
- budget management
- dashboard analytics
- report charts
- recurring transaction support
- CSV export
- PDF export
- notifications
- AI assistant

## Output Screens / Expected Output

The application provides:

- login page
- signup page
- dashboard page
- transaction entry section
- budget section
- recurring transaction section
- reports and charts section
- notifications section
- AI assistant section

## How To Run The Project

### 1. Start MongoDB

Make sure MongoDB is running on your system.

Default local database:

```text
mongodb://127.0.0.1:27017/wealthwave
```

### 2. Backend Setup

Open terminal in the `server` folder:

```bash
cd server
```

Create `.env` file from `.env.example`

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wealthwave
JWT_SECRET=wealthwave-local-dev-secret
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=
```

Install dependencies and start backend:

```bash
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Note:
If `http://localhost:5000/` shows `Route not found: /`, that is normal because the backend is an API server and not a normal webpage.

### 3. Frontend Setup

Open terminal in the `client` folder:

```bash
cd client
```

Create `.env` file from `.env.example`

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start frontend:

```bash
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## How To Check The Database

Database name:

```text
wealthwave
```

Collections used:

- `users`
- `transactions`
- `budgets`
- `recurringtransactions`
- `notifications`

### Option 1: MongoDB Compass

- open MongoDB Compass
- connect to `mongodb://127.0.0.1:27017`
- open database `wealthwave`
- check the collections

### Option 2: Mongo Shell

```bash
mongosh
use wealthwave
show collections
db.users.find().pretty()
db.transactions.find().pretty()
db.budgets.find().pretty()
db.recurringtransactions.find().pretty()
db.notifications.find().pretty()
```

## Main API Routes

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard/summary`

### Transactions

- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Budgets

- `GET /api/budgets`
- `POST /api/budgets`

### Reports

- `GET /api/reports/overview`
- `GET /api/reports/export/transactions.csv`

### Recurring Transactions

- `GET /api/recurring`
- `POST /api/recurring`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

### Assistant

- `POST /api/assistant/chat`

## Current Status

The project is currently working locally with:

- React frontend
- Express backend
- MongoDB database
- authentication and validation
- dashboard and reports
- transactions and budgets
- recurring entries
- CSV/PDF export
- notifications
- AI assistant

## Future Scope

- edit transaction feature in UI
- advanced filters by date and category
- better notification controls
- stronger admin/testing support
- deployment on Vercel and Render
- real OpenAI integration using API key

## Conclusion

WealthWave is a practical and user-friendly personal finance management system.

It helps users record, analyze, and improve financial habits through structured data entry, charts, budgeting, recurring plans, exports, and assistant support.

This project can be further extended into a more advanced financial planning platform in the future.
