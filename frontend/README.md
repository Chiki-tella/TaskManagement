# TaskFlow Frontend

This is the React frontend for the TaskFlow application, an interactive and gamified task management system.

## 🚀 Technologies Used
- **React**: Component-based UI rendering.
- **Vite**: Ultra-fast frontend build tool and development server.
- **React Router DOM**: Client-side routing for seamless page transitions (SPA).
- **Lucide React**: Beautiful, modern SVG icons.
- **React Confetti**: Celebration animations for completing tasks.
- **CSS3 / Glassmorphism**: Premium styling with frosted-glass effects and smooth micro-animations.

## 📂 Project Structure
- `src/App.jsx` - The main routing file (controls public/private routes).
- `src/AuthContext.jsx` - Global state management for user authentication, XP, and Streaks.
- `src/Home.jsx` - The beautifully designed public landing page.
- `src/Dashboard.jsx` - The main authenticated view for managing tasks and viewing gamification stats.
- `src/Login.jsx` & `src/Register.jsx` - Authentication screens.
- `src/index.css` - Global CSS containing our custom design system and layout utility classes.

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
To start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`. 

*Note: Ensure the Spring Boot backend is running simultaneously on `http://localhost:8080/` to handle API requests and authentication.*

## 🎮 Gamification Features
The frontend heavily focuses on user motivation:
- Completing a task instantly fires a massive confetti burst!
- The dashboard header dynamically tracks your `XP`, `Level`, and `Daily Streak`.
- Motivational empty states (with random dynamic quotes) appear when all tasks are complete.
