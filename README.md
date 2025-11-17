🏠 Hostel Hub – A Unified Platform for Hostel Operations
🔗 Live Application

Frontend: https://hostel-hub-management-system-yzo8.onrender.com/

Backend API: Hosted on Railway

📌 About the Project

Hostel Hub is a web-based management system built to streamline everyday hostel activities.
It brings students, administrators, and maintenance personnel onto a single platform, enabling smooth communication, faster issue resolution, and easy access to essential information like notices and schedules.

The platform uses role-based access, JWT authentication, and a clean separation between frontend and backend.

✨ Core Functionalities
👨‍🎓 Student Portal

View the latest announcements and notices

Submit maintenance complaints

Track issue status

Check bus schedules and available medical services

🔧 Repair Staff Dashboard

See all issues assigned by admin

Update task progress instantly

View complaint details in one place

🧑‍💼 Admin Console

Publish and edit notices

Assign repairers to student-reported issues

Manage student details, doctor information & transport timings

🛠️ Technology Used
Frontend

React (Vite)

React Router

Tailwind CSS

shadcn/ui component library

Backend

Flask (Python)

Flask-JWT-Extended

Flask-CORS

SQLAlchemy with SQLite database

Render (hosting frontend)

Railway (hosting backend)

🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure access control.
Each user has specific permissions based on their assigned role (Student, Admin, Repairer).

🏗️ System Architecture
React Frontend  →  Flask REST API  →  SQLite Database


The frontend interacts with the backend exclusively through secured API endpoints, keeping the structure modular and maintainable.

⚙️ How to Run the Project Locally
▶️ Backend Setup
cd backend
python -m venv .venv

# Activate the environment
# Linux/Mac:
source .venv/bin/activate
# Windows:
.\.venv\Scripts\activate

pip install -r requirements.txt
flask db upgrade   # only if migrations are present
python app.py

▶️ Frontend Setup
cd frontend
npm install
npm run dev

🌐 Local Access Links

Frontend: http://localhost:5173

Backend API: http://localhost:8080
