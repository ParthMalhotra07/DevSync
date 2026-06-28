# DevSync

DevSync is a collaborative engineering workspace inspired by GitHub Projects, Jira, and Linear. Built with the MERN stack (MongoDB, Express, React, Node.js), it empowers software teams to manage organizations, projects, and tasks in real-time.

## Features

- **Organizations & Teams**: Hierarchical management of teams and projects.
- **Interactive Kanban Boards**: Drag-and-drop task management built with `@hello-pangea/dnd`.
- **Real-Time Collaboration**: Instant notifications and live updates using `Socket.io`.
- **Rich Task Details**: Add descriptions, prioritize work, set due dates, and assign team members.
- **Comments & File Uploads**: Converse directly on tasks and attach files (powered by Cloudinary).
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Socket.io-client
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, Multer, Cloudinary
- **Design System**: Lucide Icons, Custom UI Components

## Getting Started

### Prerequisites

Make sure you have Node.js and MongoDB installed on your system. You will also need a Cloudinary account for file uploads.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ParthMalhotra07/DevSync.git
   cd DevSync
   ```

2. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Environment Variables Setup:
   Create a `.env` file in the `server` directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Architecture Highlights

- **Modular Routes & Controllers**: Clean separation of concerns in the Express backend.
- **Optimistic UI Updates**: The frontend Kanban board immediately updates the UI during drag-and-drop actions, making the application feel lightning fast, while syncing with the backend silently.
- **RESTful API**: Standardized API design for predictable data fetching.
