# Task Tracker Application

A modern full-stack task management application built with Next.js, TypeScript, and GraphQL, using a monorepo structure.

## Project Structure

```
task-tracker/
├── apps/              # Application packages
│   ├── web/          # Next.js frontend application
│   └── server/       # Backend GraphQL server
├── packages/         # Shared packages
│   ├── ui/          # Shared UI components
│   ├── config/      # Shared configuration
│   └── types/       # Shared TypeScript types
├── tools/           # Development tools and scripts
├── docs/            # Documentation
├── docker/          # Docker configuration
└── .github/         # GitHub workflows and templates
```

## Tech Stack

### Frontend
- Next.js 14
- TypeScript 5.3.3
- TailwindCSS
- Shadcn UI
- Apollo Client
- React Query

### Backend
- Node.js
- TypeScript
- Apollo Server
- Express
- AWS DynamoDB

### Development Tools
- pnpm (Package Manager)
- Turborepo (Build System)
- ESLint 9.x
- TypeScript
- Docker

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- pnpm (Latest version)
- Docker (for local development)
- AWS DynamoDB (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-tracker
```

2. Install dependencies:
```bash
pnpm install
```

### Running the Application

1. Start the development environment:
```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4001

### Development Scripts

#### Root Workspace
- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run ESLint across all packages
- `pnpm test` - Run tests across all packages

#### Web Application
- `pnpm dev:web` - Start frontend development server
- `pnpm build:web` - Build frontend for production
- `pnpm start:web` - Start production frontend server

#### Backend Server
- `pnpm dev:server` - Start backend development server
- `pnpm build:server` - Build backend for production
- `pnpm start:server` - Start production backend server
- `pnpm init-db` - Initialize database
- `pnpm seed` - Seed database with sample data

## Features
- Task management (CRUD operations)
- User management
- Role-based access control
- Task assignment
- Priority levels
- Due date tracking
- Recurring tasks
- Real-time updates
- Responsive design
- Dark/Light mode

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the ISC License.
