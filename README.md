# Task Tracker Application

A full-stack task management application built with React, TypeScript, and GraphQL.

## Project Structure

```
task-tracker/
├── src/                 # Frontend source code
├── server/             # Backend GraphQL server
├── public/             # Static assets
├── docs/              # Documentation
└── docker/            # Docker configuration
```

## Tech Stack

### Frontend
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.1.3
- Apollo Client 3.9.5
- Material-UI 5.15.11
- React Router 6.22.1

### Backend
- Node.js
- TypeScript
- Apollo Server 4.10.0
- Express 4.18.2
- AWS DynamoDB

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm (Latest version)
- AWS DynamoDB (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-tracker
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```
The GraphQL server will start on http://localhost:4001

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

### Development Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run init-db` - Initialize database
- `npm run seed` - Seed database with sample data
- `npm run clear` - Clear database
- `npm run test-graphql` - Test GraphQL queries

## Database Schema

The application uses AWS DynamoDB with the following tables:
- Users
- Tasks

### Sample Data
The application comes with sample data including:
- Users with different roles (ADMIN, MANAGER, USER)
- Tasks with various statuses and priorities

## Features
- Task management (CRUD operations)
- User management
- Role-based access control
- Task assignment
- Priority levels
- Due date tracking
- Recurring tasks

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the ISC License.
