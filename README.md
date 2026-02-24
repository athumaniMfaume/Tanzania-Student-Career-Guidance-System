# 🇹🇿 Tanzania Student Career Guidance System

[![Live Demo](https://img.shields.io)](https://tanzania-student-career-guidance-system.onrender.com)
[![License: ISC](https://img.shields.io)](https://opensource.org)

A comprehensive full-stack (MERN) platform built to empower Tanzanian secondary school students with data-driven career choices. This system bridges the gap between high school subject combinations and university entrance requirements.

## 🚀 Why This Project?
Many students in Tanzania face challenges when transitioning from O-Level to A-Level and eventually to Higher Education. This platform provides:
- **Clarity**: Mapping specific subject combinations (e.g., PCM, HGL, CBG) to relevant University programs.
- **Direction**: Helping students discover careers that match their strengths and interests.
- **Information**: A centralized directory of schools, programs, and career prospects.

## ✨ Key Features
- **Smart Career Mapping**: Analyzes student interests and suggests viable career paths.
- **Education Directory**: Explore Tanzanian universities and the specific degree programs they offer.
- **Subject Combination Guide**: Detailed breakdown of which A-level combinations are required for various bachelor degrees.
- **Job Market Insights**: Real-world job roles and the educational qualifications needed to attain them.
- **Responsive UI**: Optimized for both mobile and desktop access using Tailwind CSS.

## 🛠️ Technical Stack
- **Frontend**: React 19 (Vite), Tailwind CSS, React Router, Axios.
- **Backend**: Node.js, Express 5.x (using Regex routing for SPA support).
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt for secure user sessions.
- **Deployment**: Render (Single-service monorepo configuration).

## 📂 Project Structure
```text
├── backend/            # Express server, API routes, and Models
├── frontend/           # React application (Vite)
├── package.json        # Root script manager for monorepo
└── .env                # Environment variables (Local only)
Use code with caution.

⚙️ Installation & Local Setup
Clone the repository:
bash
git clone https://github.com
cd Tanzania-Student-Career-Guidance-System
Use code with caution.

Install all dependencies:
(Run from the root folder to install for both backend and frontend)
bash
npm run install-all
Use code with caution.

Configure Environment Variables:
Create a .env file in the root and add:
env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
Use code with caution.

Run in Development Mode:
bash
npm run dev
Use code with caution.

The frontend will run on http://localhost:5173 and the backend on http://localhost:5000. 
🌐 Deployment
This project is configured for Render. 
Build Command: npm run build
Start Command: npm start
Frontend Build: Vite generates static files in frontend/dist, which are served by the Express backend in production.
👤 Author
Athumani Mfaume 
LinkedIn: https://www.linkedin.com/in/athumani-mfaume-jr-204bb81b0/
Portfolio: https://athumanimfaume.netlify.app/