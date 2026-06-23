# BookingHotel

A full-stack hotel booking platform featuring a robust backend API and a modern frontend interface.

## 🚀 Tech Stack

### Frontend (FE)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Bootstrap Grid System, SCSS/CSS
- **Features:** Next Image Optimization, AOS Animations, SEO Optimized

### Backend (BE)
- **Framework:** Django (Python)
- **Database:** PostgreSQL (Neon)
- **Features:** RESTful API, Database Management, Hotel/Booking Administration

---

## 📂 Project Structure

```text
BookingHotel/
├── BE/                 # Django Backend Application
│   ├── app/            # Core Django app
│   ├── manage.py       # Django project management script
│   └── ...             # Utilities & templates
├── FE/                 # Next.js Frontend Application
│   ├── app/            # Next.js app router pages
│   ├── src/            # Source components (e.g., HotelCard)
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
└── README.md           # This file
```

---

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (for Frontend)
- [Python 3.8+](https://www.python.org/) (for Backend)

### 1. Backend Setup (Django)

Open a terminal and navigate to the `BE` directory:
```bash
cd BE
```

Create a virtual environment and activate it:
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies (if `requirements.txt` is available):
```bash
pip install -r requirements.txt
```

Set up Environment Variables:
- Make sure you have a `.env` file in the `BE` directory.
- It should contain variables like `SECRET_KEY`, `DEBUG`, and `DATABASE_URL` (connecting to your Neon PostgreSQL database).

Run Database Migrations:
```bash
python manage.py migrate
```

Start the Backend Server:
```bash
python manage.py runserver
```
The backend will run at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup (Next.js)

Open a new terminal and navigate to the `FE` directory:
```bash
cd FE
```

Install Dependencies:
```bash
npm install
# or yarn install / pnpm install
```

Set up Environment Variables:
- Copy `.env.local.example` to `.env.local`.
- Update variables to point to your local backend API if needed.

Start the Frontend Development Server:
```bash
npm run dev
```
Open your browser and visit: `http://localhost:3000`

---

## 📜 Scripts & Utilities

The `BE` directory contains several utility scripts for managing the application's data:
- `import_images.py`: Script to import or associate hotel images.
- `approve_hotels.py`: Admin utility to approve hotels.
- `fix_hotels.py` / `fix_stars.py`: Data correction and processing scripts.
