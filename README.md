# **Holidaze - Accommodation Booking Platform**
### *Semester Project 2 - Final Exam*
### *By Anniken Olsen Hammerstad*

---

## Overview
This project is the final delivery of my second-year semester exam. Holidaze is a fully functional accommodation booking platform built with React, TypeScript, Tailwind CSS, and the Noroff API. The focus has been to create a fast, accessible, and modern booking experience that aligns with real-world development practices.

The application supports both customer and venue manager roles with separate workflows, full CRUD functionality, booking management, responsive layouts, global error handling, and WCAG-oriented polish.

## Features

### Customer Experience
- Browse venues with search, filters, and sorting
- View venue details including gallery, reviews, amenities, and availability
- Book stays using a date range picker with disbled booked dates
- Personal profile with upcoming bookings
- Automatic login after registration
- Global toasts for feedback and error handling

### Venue Manager Experience
- Create, edit, and delete venues
- Dashboard showing created venues and upcoming bookings
- Input validation and image preview
- Edit venue details with accessible form structure

### Core Platform Features
- Fully responsive layout on all breakpoints
- Keyboard-friendly navigation and visible focus states
- WCAG AA-tested color contrast
- High Lighthouse scores
- Smooth transitions and micro-interactions
- Clean, semantic HTML
- Fallback images and defensive data checks
- Production deployment via Netlify

### Booking System
Users can select date ranges with React Datepicker, choose the number of guests, and see unavailable dates based on existing bookings. Bookings lead to a confirmation page with details.

### Search and Filters
The app includes global venue search, search suggestions in VenueDetail, guest filtering and sorting by rating or price.

### Global Toast Messages
All feedback messages use react-hot-toast instead of alerts.
Success and error states are handled consistently across forms and API calls.

### Accessibility
The project follows WCAG 2.1 AA guidelines.
Semantic HTML, alt text, keyboard navigation, visual focus states and contrast checks were implemented and validated with Lighthouse and WAVE.

### Responsive Layout
The entire interface is fully responsive using Tailwind CSS and supports mobile, tablet and desktop screens.

## Tech Stack

- React + TypeScript
- Tailwind CSS
- React Router
- react-hot-toast
- react-datepicker
- Vite
- Noroff v2 API

## Accessibility and Performance

This project was built with accessibility in mind from the beginning.
Completed checks include:

- Semantic HTML
- ARIA labels where needed
- Logical heading structure
- Visible focus styles
- WCAG AA color contrast validation
- WAVE audit with no critical errors
- Lighthouse scores 90+ in key categories

## Code Architecture

```txt
src/
api/
bookings.ts
listings.ts
auth.ts
client.ts
components/
Navbar.tsx
Footer.tsx
PromoBanner.tsx
pages/
BookingConfirmation.tsx
CreateVenue.tsx
EditProfile.tsx
EditVenue.tsx
Home.tsx
Login.tsx
ManagerDashboard.tsx
NotFound.tsx
Profile.tsx
Register.tsx
VenueDetail.tsx
VenuesList.tsx
types/
booking.ts
user.ts
venue.ts
App.tsx
main.tsx
```

## Installation

git clone https://github.com/ankiiin/holidaze-pe2-annikenhammerstad
cd holidaze-pe2-annikenhammerstad
npm install
npm run dev

## Testing and Validation
Lighthouse: Accessibility, Best Practices and SEO score above 90.
WAVE: All critical accessibility errors fixed.
HTML validation: No blocking errors.
Manual testing covered booking flow, authentication, venue CRUD, role protection, responsiveness and error handling.

## Reflection
This project has been one of the most comprehensive and rewarding ones I have worked on. It has allowed me to apply everything I have learned: clean architecture, API handling, UX principles, accessibility, responsive design and structured workflows.
Holidaze is a project I am proud to end my studies with.

## Links
Live site: https://holidaze-pe2-annikenhammerstad.netlify.app/
GitHub repository: https://github.com/ankiiin/holidaze-pe2-annikenhammerstad
Figma design: https://www.figma.com/design/iLbdSvmAijYDO6fbNYW96Y/Holidaze-PE2?node-id=0-1&t=ZuOVr9E5ouhjCxcV-1

## Created by
**Anniken Olsen Hammerstad**
Frontend Developer and UX Designer
