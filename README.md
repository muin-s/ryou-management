# 🏠 Hostel Hub – Smart Hostel Management System

**Live Demo:** [https://hostel-hub-management-system-yzo8.onrender.com/](https://hostel-hub-management-system-yzo8.onrender.com/)
**Backend API:** Hosted on Railway
**Frontend:** React + Vite

---

## 📖 Overview

**Hostel Hub** is a complete hostel management platform designed for students, admins, and repair staff. It simplifies day-to-day operations — from issue reporting and notice updates to bus timetables and medical records — through a centralized web dashboard.

The system supports **JWT-based authentication**, **role-specific dashboards**, and **seamless communication** among users.

---

## 🚀 Features

### 👩‍🎓 Student

* View notices and announcements
* Raise and track maintenance issues
* Access bus timetables and medical services

### 🧑‍🔧 Repairer

* View and manage assigned repair tasks
* Update issue status in real-time

### 🧑‍💼 Admin

* Post and manage notices
* Assign repairers to reported issues
* Manage doctors, students, and timetables

---

## ⚙️ Tech Stack

**Frontend:**

* React (Vite)
* React Router
* Tailwind CSS
* shadcn/ui components

**Backend:**

* Flask (Python)
* Flask-JWT-Extended
* Flask-CORS
* SQLAlchemy + SQLite
* Render (for frontend)
* Railway (for backend)

---

## Screenshot

<img width="1852" height="934" alt="image" src="https://github.com/user-attachments/assets/6b5e95d5-e0b7-4121-be1d-d6c686b8c3ae" />

<img width="1852" height="934" alt="image" src="https://github.com/user-attachments/assets/091a9724-eebf-477e-838b-7e9d5ef79816" />

---

## 🔐 Authentication

* **JWT (JSON Web Token)** is used for secure and stateless authentication.
* Users are authorized based on their roles (Student / Admin / Repairer).

---

## 🧠 Architecture

```
Frontend (React) → REST API (Flask) → Database (SQLite)
```

The system follows a clean separation between frontend and backend, communicating via secure API routes.

---

## 🧰 Setup Instructions

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # on Linux/Mac
# or .\.venv\Scripts\activate on Windows

pip install -r requirements.txt
flask db upgrade  # if migrations exist
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit:

* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:8080`
