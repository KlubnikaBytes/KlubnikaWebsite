# UI Modernization and Responsiveness Plan

The goal is to overhaul the aesthetics of the React admin portal to be highly professional, modern, and completely responsive across mobile and desktop devices, without altering any underlying business logic or API calls.

## Objective
* Refine the overall design language to use modern UI trends (glassmorphism, softer shadows, rounded UI, gradients, dynamic hover states).
* Ensure every page is perfectly responsive on mobile screens (fixing broken margins, overlapping elements, scrolling issues).
* Completely redesign the Login page to look beautiful and function correctly on all devices.

## Proposed Changes

We will modify the styling (Tailwind CSS classes) in the following core components:

### 1. Authentication & Layout
#### [MODIFY] `frontend/src/admin/pages/auth/AdminLogin.jsx`
* **Changes:** Completely redesign the login screen. Move away from the basic dark gray box to a modern split-screen design or a centered glassmorphic card over a beautiful animated gradient background.
* **Responsiveness:** Ensure inputs scale correctly, font sizes are readable on mobile, and buttons stretch properly.

#### [MODIFY] `frontend/src/admin/layouts/AdminLayout.jsx`
* **Changes:** Polish the sidebar and top navbar. Use a sleek, frosted-glass top navigation bar (`backdrop-blur`). Improve the mobile hamburger menu rendering and ensure the sidebar transitions are completely smooth.
* **Responsiveness:** Ensure padding on the main `<main>` container adjusts dynamically between `px-4 pt-20` on mobile and `px-8 pt-24` on desktop.

### 2. Main Dashboards
#### [MODIFY] `frontend/src/admin/pages/dashboard/CeoDashboard.jsx`
* **Changes:** Enhance the metric cards with better gradient overlays and hover animations (`hover:-translate-y-1 hover:shadow-xl`). Adjust the activity feed to be cleaner and more readable.
* **Responsiveness:** Ensure the 4-column KPI grid falls back to 2 columns on tablets (`md:grid-cols-2`) and 1 column on mobile (`grid-cols-1`).

#### [MODIFY] `frontend/src/admin/pages/employee/EmployeeDashboard.jsx`
* **Changes:** Modernize the referral tracking cards. Use softer colors and better typography for the badges. Make the hero "Welcome Back" banner more dynamic.
* **Responsiveness:** Stack the sidebars properly on mobile, and ensure referral tables or lists wrap nicely without creating horizontal scrolls where inappropriate.

### 3. HR & Content Management
#### [MODIFY] `frontend/src/admin/pages/hr/EmployeeManager.jsx`
* **Changes:** Modernize the Personnel, Leaves, and Referral tabs. The tables currently cause layout breaks on small screens; we will enforce `overflow-x-auto` wrappers around all tables and use standard tailwind responsive table design.
* **Responsiveness:** Ensure search bars and filter drop-downs wrap onto new lines on mobile instead of shrinking to unreadable sizes.

#### [MODIFY] `frontend/src/admin/pages/cms/PageManager.jsx`
* **Changes:** Refine the Page list items to look like modern floating cards. Improve the modal designs for "Add Page" and "Edit Content" to use backdrop blur and centered flex alignments securely.
* **Responsiveness:** Modal forms will be restricted by `max-h-[90vh]` and `overflow-y-auto` to prevent breaking on small mobile screens.

### 4. Leave Management Module
#### [MODIFY] `frontend/src/admin/pages/leaves/LeaveDashboard.jsx`
#### [MODIFY] `frontend/src/admin/pages/leaves/ApplyLeaveModal.jsx`
#### [MODIFY] `frontend/src/admin/pages/leaves/LeaveDetailsModal.jsx`
* **Changes:** Apply the new unified aesthetic to the leave module. Round the table edges, use distinct status colors (emerald/rose/amber), and polish the chat interface inside the `LeaveDetailsModal` to look like a modern messaging app (iMessage/WhatsApp style bubbles).
* **Responsiveness:** The leave detail modal history and chat split-screen will be stacked vertically on mobile screens. Table will scroll horizontally gracefully.

## Verification Plan

### Manual Verification
1. I will boot up the Vite frontend (`npm run dev`).
2. Using playwright/browser testing, I will simulate mobile and desktop vieports to verify:
   * **Login flow:** Works without UI glitches on mobile.
   * **Navigation:** Sidebar opens/closes properly on mobile overlay.
   * **Tables:** Do not force the entire webpage to scroll horizontally (contained data scrolling).
   * **Modals:** Fit within the screen and scroll internally when content overfills vertically.
