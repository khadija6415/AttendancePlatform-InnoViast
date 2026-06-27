# 📋 Attendance Register

### Institutional Attendance Operations Platform

A full-stack, role-based attendance management system for institutes, bootcamps, and office teams. Admins and Instructors create class sessions and mark attendance; Students view their own attendance history.

> Built as **Assignment 1** for the InnoViast Full-Stack Product Engineering track.

---

## 🔗 Live Demo

| | Link |
|---|---|
| 🌐 Frontend | _add your deployed link here_ |
| ⚙️ Backend API | _add your deployed link here_ |

---

## ✨ Features

- 🔐 **Authentication** — Secure signup/login with JWT tokens and bcrypt password hashing
- 👥 **Role-based access** — Admin, Instructor, and Student roles, each with distinct permissions
- 🗂️ **Class management** — Admins and Instructors create and schedule class sessions
- ✅ **Attendance marking** — Mark each student Present, Absent, or Late per session
- 📊 **Reports & filtering** — Filter attendance history by class and status
- 📥 **CSV export** — Download attendance reports for offline records
- 🎨 **Professional UI** — Clean, responsive design built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT, bcrypt.js |
| **Tooling** | Git & GitHub |

---

## 🗄️ Database Schema

<details>
<summary><strong>User</strong></summary>

| Field | Type | Description |
|---|---|---|
| `name` | String | Full name of the user |
| `email` | String | Unique email, used for login |
| `password` | String | Hashed password (bcrypt) |
| `role` | String | `admin`, `instructor`, or `student` |

</details>

<details>
<summary><strong>Class</strong></summary>

| Field | Type | Description |
|---|---|---|
| `title` | String | Name of the class/session |
| `instructor` | ObjectId → User | Instructor assigned to the class |
| `date` | Date | Date of the session |
| `time` | String | Time of the session |
| `createdBy` | ObjectId → User | User who created the class |

</details>

<details>
<summary><strong>Attendance</strong></summary>

| Field | Type | Description |
|---|---|---|
| `student` | ObjectId → User | Student the record belongs to |
| `session` | ObjectId → Class | Class session the record belongs to |
| `status` | String | `present`, `absent`, or `late` |
| `markedAt` | Date | Timestamp when attendance was marked |

</details>

---

## 📁 Project Structure

```
AttendancePlatform-InnoViast/
├── client/                  (React frontend)
│   └── src/
│       ├── pages/           (Login, Dashboard, AttendanceMarking, Reports)
│       ├── components/      (Reusable components - ClassForm)
│       └── context/         (AuthContext - login state)
├── server/                  (Node/Express backend)
│   ├── models/               (User, Class, Attendance schemas)
│   ├── controllers/          (Business logic)
│   ├── routes/                (API route definitions)
│   └── middleware/          (JWT auth + role-based authorization)
└── README.md
```
