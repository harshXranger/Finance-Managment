#	🌊 WealthWave: Smart Personal Finance Manager
WealthWave is a high-performance, full-stack web application designed to help users take control of their financial life. Move away from messy spreadsheets and enjoy a visual, automated way to track your wealth.

#	📌 Table of Contents
*	Features
*	Problem Statement
*	Tech Stack
*	System Architecture
*	Getting Started
*	API Reference
*	Database Schema
*	Future Roadmap


#	✨ Features
##	WealthWave isn't just a ledger; it's a financial command center:
*	📊 Dynamic Dashboard: At-a-glance view of total balance, savings rate, and recent activity.
*	🛡️ Secure Auth: JWT-based sessions with bcrypt encryption and strict Gmail-only validation.
*	💰 Smart Budgeting: Set monthly limits and receive automated over-budget warnings.
*	🔄 Recurring Transactions: Automate your bills and subscriptions.
*	📈 Visual Insights: Beautifully rendered charts (via Chart.js) for category-wise spending.
*	📑 Data Export: Download your data in CSV or PDF formats for offline review.
*	🤖 AI Assistant: Get financial advice through a built-in AI module (OpenAI supported).


#	❓ Problem Statement
*	Traditional finance management via notebooks or Excel leads to:
*	Information Silos: Scattered records.
*	Invisibility: Overspending without realizing it.
*	Complexity: Manual calculations are prone to error.

##	**WealthWave** centralizes your activity, providing clarity through visualization.

🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (NoSQL) |
| **Auth** | JWT (JSON Web Tokens), Bcrypt |
| **Exports** | PDFKit / CSV-Writer |


#	📐 System Architecture
##	The application follows a classic MERN decoupling:
####	Code snippet
```text
graph TD
    A[Frontend: React + Vite] -->|REST API| B[Backend: Node.js + Express]
    B -->|Mongoose| C[Database: MongoDB]
    B -->|External API| D[OpenAI / Local AI]
```
#🚀 Getting Started
###	1. Prerequisites
*	MongoDB installed and running locally (port 27017)
*	Node.js (v16+)2.
###	2.Backend Setup
```text
cd server
npm install
# Create a .env file based on .env.example
npm run dev
```
###	3. Frontend Setup
```text
cd client
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
```
#	📡 API Reference
Authentication
|	Method	|	Endpoint	|	Description	|
| :--- | :--- |:--- | 
|	**POST**	|	/api/auth/signup	|	Register a new user (@gmail only)|
|	**POST**	|	/api/auth/login		|	Login and receive JWT|

#	Transactions & Reporting
|Method|Endpoint|Description|
| :--- | :--- |:--- | 
|GET	|/api/transactions|	Fetch all user transactions|
|POST|/api/transactions|Create a new entry|
|GET|/api/reports/overview|Get data for charts|
|GET|/api/reports/export/transactions.csv|Download CSV report|


#	🗄 Database Schema
####	WealthWave uses five main collections:
*	**Users:** Profiles and encrypted credentials.
*	**Transactions:** History of all money flow.
*	**Budgets:** User-defined limits per month.
*	**RecurringTransactions:** Blueprints for automated entries.
*	**Notifications:** System alerts and budget warnings.

#	🔮 Future Roadmap
*	[ ] Advanced Filtering: Filter by date ranges and custom categories.
*	[ ] Cloud Deployment: CI/CD integration for Vercel (Frontend) and Render (Backend).
*	[ ] Admin Dashboard: High-level overview for platform management.
*	[ ] Enhanced AI: Predictive spending analysis.

#	🤝 Conclusion
###	WealthWave aims to bridge the gap between "earning" and "understanding." Whether you are a student or a professional, this tool provides the structure needed for a healthier financial future.
