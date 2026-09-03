# 🏥 HealthCare Client Application

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query/latest)
[![Recharts](https://img.shields.io/badge/Recharts-v3.10-22b5bf?style=for-the-badge)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

A modern, responsive, enterprise-ready **Telemedicine & Healthcare Frontend Application** built with **Next.js 16 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **TanStack React Query v5**.

The client provides dedicated role-based portals for **Patients**, **Doctors**, and **Administrators**, featuring real-time appointment scheduling, Stripe checkout integration, electronic health records (EHR), prescription management, and interactive analytics dashboards.

---

## 📑 Table of Contents

- [📌 Overview](#-overview)
- [✨ Key Features & Modules](#-key-features--modules)
  - [1. Authentication & Role-Based Access Control (RBAC)](#1-authentication--role-based-access-control-rbac)
  - [2. Public Consultation & Discovery Portal](#2-public-consultation--discovery-portal)
  - [3. Appointment Booking & Payment Processing](#3-appointment-booking--payment-processing)
  - [4. Patient Portal (`/dashboard`)](#4-patient-portal-dashboard)
  - [5. Doctor Portal (`/doctor/dashboard`)](#5-doctor-portal-doctordashboard)
  - [6. Admin & Management Portal (`/admin/dashboard`)](#6-admin--management-portal-admindashboard)
  - [7. UI/UX Design System & Theming](#7-uiux-design-system--theming)
- [🛠 Tech Stack & Core Libraries](#-tech-stack--core-libraries)
- [📂 Client Directory Architecture](#-client-directory-architecture)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [🔗 API Integration & Services](#-api-integration--services)
- [📜 Scripts Reference](#-scripts-reference)
- [🤝 License](#-license)

---

## 📌 Overview

The **HealthCare Client** is designed to deliver a fast, accessible, and intuitive healthcare experience. It handles all user interactions, state synchronization, form validations, dynamic slot scheduling, token persistence, and role-based views.

### Architectural Highlights:
- **Next.js 16 App Router**: Leverages Server Components (RSC) and Client Components for optimized data streaming and fast first-contentful paint.
- **Role Isolation**: Strict route groups isolating public marketing pages, authentication flows, and protected dashboard layouts.
- **Server State Management**: Powered by **TanStack React Query v5** for optimistic updates, background caching, and automatic refetching.
- **Type Safety**: End-to-end typing with TypeScript and Zod schema validations for every form.
- **Dual Theme Support**: Flawless Dark/Light mode switching with tailored Tailwind CSS v4 variables.

---

## ✨ Key Features & Modules

### 1. Authentication & Role-Based Access Control (RBAC)
- **Multi-Role Authentication**: Dedicated routing and layouts tailored to `PATIENT`, `DOCTOR`, `ADMIN`, and `SUPER_ADMIN`.
- **OTP Verification Flow**: Step-by-step account verification using time-limited 6-digit email OTPs.
- **Secure Token Handling**: Axios client configured with automatic cookie management, token refresh handling, and credentials forwarding.
- **Password Recovery & Reset**: Intuitive password reset interface with OTP validation.
- **Route Guard Middleware**: Protects private routes and intelligently redirects users based on their active role.

### 2. Public Consultation & Discovery Portal
- **Interactive Home / Landing Page (`/`)**:
  - Live statistics, specialist highlights, user feedback testimonials, and healthcare pillars.
- **Doctor Consultation Directory (`/consultation`)**:
  - Filter doctors by specialty (Cardiology, Neurology, Pediatrics, Orthopedics, etc.).
  - Search by doctor name, qualification, or experience.
  - Doctor profile cards displaying ratings, fee per consultation, and real-time availability badges.
- **Health Information Pages**:
  - **Health Plans (`/health-plans`)**: Tiered healthcare packages (Individual, Family, Senior, Corporate).
  - **Diagnostics (`/diagnostics`)**: Lab test catalog, pricing, sample collection info, and health packages.
  - **Online Pharmacy (`/medicine`)**: Prescription medicine showcase, OTC categories, and delivery details.
  - **NGOs & Community Healthcare (`/ngos`)**: Subsidized clinical programs, health camps, and charity drives.

### 3. Appointment Booking & Payment Processing
- **Real-Time Schedule Selector Modal**:
  - Dynamic calendar date-picker.
  - Live doctor time-slot selection with conflict prevention.
- **Stripe Checkout Integration**:
  - Automatic redirect to Stripe checkout session with breakdown of consultation fees, taxes, and service charges.
- **Payment Verification & Receipts**:
  - **Success Screen (`/payment/success`)**: Confirms booked appointment with transaction details and meeting guidelines.
  - **Cancel / Retry Screen (`/payment/cancel`)**: Clean retry interface for failed or aborted payments.

### 4. Patient Portal (`/dashboard`)
- **Patient Dashboard Overview**: Summary of upcoming appointments, active prescriptions, and recent doctor interactions.
- **My Appointments (`/dashboard/my-appointments`)**: Real-time list of scheduled, ongoing, and completed visits with one-click video consultation links.
- **My Prescriptions (`/dashboard/my-prescriptions`)**: View and download digital prescriptions issued by doctors.
- **Health Records (`/dashboard/health-record`)**: Comprehensive medical profile tracking blood group, allergies, past diagnoses, and uploaded clinical reports.
- **Payment History (`/dashboard/payment`)**: Complete ledger of transactions with payment status and receipt details.
- **Account & Security Settings**: Update profile data, avatar, and change password (`/change-password`).

### 5. Doctor Portal (`/doctor/dashboard`)
- **Doctor Metrics & KPIs**: Total patients treated, today's appointments count, total earnings, and average rating scores.
- **Schedule Management (`/doctor/dashboard/my-schedules`)**:
  - Define weekly and daily consultation hours.
  - Slot activation, deletion, and real-time status view.
- **Appointment Operations (`/doctor/dashboard/appointments`)**:
  - Filter patient visits by status (`SCHEDULED`, `INPROGRESS`, `COMPLETED`, `CANCELED`).
  - View patient clinical history and launch teleconsultations.
- **Digital Prescription Issuer (`/doctor/dashboard/prescriptions`)**:
  - Structured form for diagnosis, medicine names, dosage, instructions, and follow-up advice.
- **Patient Reviews (`/doctor/dashboard/my-reviews`)**: View feedback and star ratings submitted by treated patients.

### 6. Admin & Management Portal (`/admin/dashboard`)
- **Analytics Overview**: Visual charts powered by `Recharts` displaying appointment volume, user registrations, and platform revenue.
- **Doctor Management (`/admin/dashboard/doctors-management`)**:
  - Onboard verified doctors with registration numbers, specialties, and pricing.
  - Manage status (active, suspended, soft-deleted).
- **Patient Management (`/admin/dashboard/patients-management`)**: View registered patients and health profile statuses.
- **Specialty Management (`/admin/dashboard/specialties-management`)**:
  - Full CRUD operations for medical specialties with custom icon uploads.
- **Schedule Master Management (`/admin/dashboard/schedules-management`)**: System-wide slot creation and time-slot scheduling.
- **Doctor Schedule Assignments (`/admin/dashboard/doctor-schedules-managament`)**: Monitor and assign schedules to specific doctors.
- **Prescriptions & Appointments Audit**: System-wide clinical audit log.
- **Financial & Payment Oversight (`/admin/dashboard/payments-management`)**: Transaction history, payment statuses, and gateway payloads.

### 7. UI/UX Design System & Theming
- **Theme Toggle**: Light and Dark mode using `next-themes` with CSS design tokens.
- **Shared Components**:
  - Reusable `DataTable` with server-side/client-side pagination, sorting, and search filtering.
  - Accessible modals, confirmation dialogs, dropdowns, and badges built on `@base-ui/react` and `shadcn`.
  - Form validation with `react-hook-form` and `zod`.
- **Responsive Layout**: Mobile-optimized dashboard sidebars and navigation drawer.

---

## 🛠 Tech Stack & Core Libraries

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16.3.2](https://nextjs.org/) | App Router, Server Components, Route Handlers |
| **UI Library** | [React 19.2.8](https://react.dev/) | Component architecture & modern hooks |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict static typing across all modules |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS engine |
| **UI Primitives** | [@base-ui/react](https://base-ui.com/) & [Shadcn UI](https://ui.shadcn.com/) | Accessible, unstyled UI primitives |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) | Server-state caching and synchronization |
| **HTTP Client** | [Axios](https://axios-http.com/) | Custom interceptors, token attaching, and cookie credentials |
| **Form & Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | High-performance forms with schema validation |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, lightweight SVG icon set |
| **Data Visualization** | [Recharts 3.10](https://recharts.org/) | Responsive charts for admin dashboards |
| **Date Management** | [date-fns](https://date-fns.org/) & [react-day-picker](https://daypicker.dev/) | Date formatting and calendar scheduling |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) | Theme switching with zero layout shift |

---

## 📂 Client Directory Architecture

```text
HealthCare-Client/
├── public/                             # Public static assets, logos, brand icons
├── src/
│   ├── app/                            # Next.js App Router (File-based Routing)
│   │   ├── (commonLayout)/             # Public layout with Navbar & Footer
│   │   │   ├── (authRouteGroup)/       # /login, /register, /forget-password, /verify-email
│   │   │   ├── consultation/           # Doctor consultation search & booking directory
│   │   │   ├── diagnostics/            # Diagnostic lab tests & health packages
│   │   │   ├── health-plans/           # Subscription healthcare plans
│   │   │   ├── medicine/               # Online pharmacy & medicine catalog
│   │   │   ├── ngos/                   # Community health & NGO medical camps
│   │   │   └── layout.tsx              # Common layout wrapper
│   │   ├── (dashboardLayout)/          # Authenticated Layouts (Sidebar + Header)
│   │   │   ├── admin/dashboard/        # Admin & Super Admin dashboard sub-routes
│   │   │   ├── doctor/dashboard/       # Doctor clinical workflows & schedule sub-routes
│   │   │   ├── (patientRouteGroup)/    # Patient health records, visits, payments
│   │   │   ├── (commonProtectedLayout)/# Shared profile & change password
│   │   │   └── layout.tsx              # Dashboard layout wrapper
│   │   ├── globals.css                 # Tailwind v4 theme configuration & color tokens
│   │   ├── layout.tsx                  # Root HTML shell & global providers
│   │   ├── loading.tsx                 # Top-level loading state
│   │   ├── not-found.tsx               # Custom 404 page
│   │   └── page.tsx                    # Landing page
│   ├── components/
│   │   ├── modules/                    # Feature-specific modular components
│   │   │   ├── auth/                   # LoginForm, RegisterForm, ResetPasswordForm
│   │   │   ├── consultation/           # BookAppointmentModal, DoctorList
│   │   │   ├── dashboard/              # AppointmentCharts, Statistics widgets
│   │   │   └── schedules/              # ScheduleTable, SlotCard, ScheduleModals
│   │   ├── shared/                     # Cross-cutting reusable components
│   │   │   ├── Navbar.tsx              # Global responsive header
│   │   │   ├── Footer.tsx              # Global footer
│   │   │   ├── DashboardSidebar.tsx    # Role-aware sidebar navigation
│   │   │   ├── DashboardHeader.tsx     # Dashboard top bar with user profile
│   │   │   ├── DataTable.tsx           # Generic data table with pagination
│   │   │   ├── Pagination.tsx          # Pagination controls
│   │   │   ├── SearchAndFilterBar.tsx  # Dynamic search and filter input
│   │   │   ├── ThemeToggle.tsx         # Light/Dark mode switcher
│   │   │   └── DeleteConfirmationModal.tsx # Reusable deletion dialog
│   │   └── ui/                         # Base UI components (Button, Input, Card, Badge, Dialog)
│   ├── hooks/                          # Custom React utility hooks
│   ├── lib/                            # Axios instance, JWT parsing, cookie & token utilities
│   ├── providers/                      # ReactQueryProvider, ThemeProvider
│   ├── services/                       # API service layer (auth, doctor, patient, admin, etc.)
│   ├── types/                          # TypeScript definitions & API response models
│   ├── utils/                          # Formatting & helper functions
│   └── zod/                            # Zod schemas for form validations
├── package.json                        # Project dependencies & scripts
├── tsconfig.json                       # TypeScript compiler configuration
└── next.config.ts                      # Next.js build configuration
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of `HealthCare-Client`:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Better-Auth Endpoint URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000/api/auth

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later
- **Package Manager**: `pnpm` (recommended), `yarn`, or `npm`
- **Backend Server**: Ensure `HealthCare-Server` is running on `http://localhost:5000`

---

### Installation & Run

1. **Navigate to the client directory**:
   ```bash
   cd HealthCare-Client
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   yarn install
   # or
   npm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   # or
   yarn dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 API Integration & Services

The client communicates with the backend via modular service modules located in `src/services/`:

| Service File | Domain | Key Responsibilities |
|---|---|---|
| `auth.services.ts` | Authentication | Register, login, logout, verify email, forget password, reset password, get current user (`/me`) |
| `doctor.services.ts` | Doctor Directory | Fetch doctors with specialty filters, fetch doctor profiles, doctor profile updates |
| `schedule.services.ts` | Schedules | Create time slots, fetch doctor schedules, delete slots, assign schedules |
| `appointment.services.ts` | Appointments | Book appointment, fetch patient appointments, fetch doctor appointments, update status |
| `prescription.services.ts`| Prescriptions | Create digital prescriptions, fetch doctor/patient prescription records |
| `specialty.services.ts` | Specialties | Fetch specialties, create/update/delete medical specialty categories |
| `patient.services.ts` | Patient Profile | Retrieve and update patient medical records and health profile |
| `review.services.ts` | Reviews | Fetch and submit doctor ratings and reviews |
| `admin.services.ts` | Administration | Manage doctors, manage patients, oversee system records |
| `stats.services.ts` | Analytics | Fetch platform KPI counts, revenue data, and graph metrics |

---

## 📜 Scripts Reference

| Command | Description |
|---|---|
| `pnpm dev` | Starts the Next.js development server on port `3000` with hot reloading |
| `pnpm build` | Compiles and builds the production bundle |
| `pnpm start` | Launches the production server after building |
| `pnpm lint` | Runs ESLint to check for code quality and syntax errors |

---

## 🤝 License

This project is licensed under the **MIT License**.
