# BookingHotel

A full-stack hotel booking platform featuring a robust backend API, a modern frontend interface, a dedicated Vendor Extranet, and a comprehensive System Admin dashboard.

## 🚀 Features

### 🏢 Customer Portal (Frontend)
- **Browse & Search:** Explore hotels, filter by location, and view detailed hotel/room information.
- **Booking Flow:** Select rooms, fill out checkout details, and confirm bookings.
- **Room Hold System:** Session-based temporary room holds to prevent overbooking during checkout.
- **User Account:** View booking history and profile settings.
- **Reviews & Ratings:** Leave reviews for completed stays.

### 💼 Vendor Extranet (`/extranet`)
- **Dashboard:** Overview of total bookings, revenue, and recent activity.
- **Hotel & Room Management:** Create and update hotel listings, add room types, and manage inventory.
- **Booking Management:** View incoming bookings and update their statuses (Confirm, Cancel, etc.).
- **Finance & Withdrawals:** Track total revenue, view automatically deducted platform commissions (15%), check available balances, and submit bank withdrawal requests.
- **Review Management:** Reply to customer reviews.
- **Promotions:** Create and manage discount promotions for your hotel.

### 🛡️ System Admin Panel (`/admin`)
- **Platform Dashboard:** High-level metrics of platform revenue, total users, and active hotels.
- **Approval System:** Review and Approve/Reject newly submitted hotel listings from vendors.
- **Withdrawal Management:** Process and Approve/Reject withdrawal requests from vendors to transfer funds to their bank accounts.
- **User Management:** Manage all system users, vendors, and roles.

---

## 💻 Tech Stack

### Frontend (FE)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Bootstrap 5, Custom SCSS/CSS
- **Libraries:** Recharts (Charts), React-Hot-Toast, GSAP & AOS (Animations), Swiper, Zod (Data Validation)
- **Features:** Server-Side Rendering (SSR), SEO Optimized, Responsive Design

### Backend (BE)
- **Framework:** Django (Python 3.8+)
- **Database:** PostgreSQL
- **Architecture:** Service-Repository Pattern, Observer Pattern for Event-Driven Notifications
- **Features:** RESTful API, Token-based Authentication, Transaction Management, Database Migrations

---

## 📂 Project Structure

```text
BookingHotel/
├── BE/                 # Django Backend Application
│   ├── app/            # Core Django app (Models, Views, Services)
│   ├── manage.py       # Django project management script
│   └── requirements.txt# Python dependencies
├── FE/                 # Next.js Frontend Application
│   ├── src/            
│   │   ├── app/        # Next.js App Router (Admin, Extranet, Customer)
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # API integrations, Utilities, Validation Schemas
│   │   └── types/      # TypeScript type definitions
│   ├── public/         # Static assets, images, icons
│   └── package.json    # Frontend dependencies
└── README.md           # This file
```

---

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js 20+](https://nodejs.org/) (for Frontend)
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

Install dependencies:
```bash
pip install -r requirements.txt
```

Run Database Migrations:
```bash
python manage.py migrate
```

Start the Backend Server:
```bash
python manage.py runserver
```
The backend will run at `http://127.0.0.1:8000`.

### 2. Frontend Setup (Next.js)

Open a new terminal and navigate to the `FE` directory:
```bash
cd FE
```

Install Dependencies:
```bash
npm install
```

Set up Environment Variables:
- Copy `.env.local.example` to `.env.local` (or create one).
- Update variables to point to your local backend API if needed (`NEXT_PUBLIC_BACKEND_API_BASE_URL=http://127.0.0.1:8000/api`).

Start the Frontend Development Server:
```bash
npm run dev
```
Open your browser and visit: `http://localhost:3000`

---

## 📜 Scripts & Utilities

The `BE` directory contains several utility scripts for managing the application's data:
- `import_images.py`: Script to import or associate hotel images.
- `approve_hotels.py`: Admin utility to approve hotels via CLI.
- `fix_hotels.py` / `fix_stars.py`: Data correction and processing scripts.
