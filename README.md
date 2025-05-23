# Task Tracker

A modern task management application built with React, Material-UI, and GraphQL.

## Features

- Modern Material-UI based interface
- Real-time task updates with GraphQL subscriptions
- Task management (create, read, update, delete)
- User profiles and task assignments
- Multi-tenant support

## Tech Stack

- Frontend:
  - React with TypeScript
  - Material-UI for styling
  - Apollo Client for GraphQL
  - React Router for navigation

- Backend:
  - Node.js with Express
  - Apollo Server
  - DynamoDB for data storage
  - TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start frontend (from root directory)
   npm run dev

   # Start backend (from server directory)
   cd server
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Project Structure

```
task-tracker/
├── src/                    # Frontend source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── graphql/          # GraphQL operations and schema
│   └── App.tsx           # Main application component
├── server/               # Backend source code
│   ├── src/
│   │   ├── resolvers/   # GraphQL resolvers
│   │   ├── db/         # Database operations
│   │   └── index.ts    # Server entry point
│   └── package.json
└── package.json
```

## Development

- Frontend runs on http://localhost:5173
- GraphQL server runs on http://localhost:4001/graphql
- GraphQL Playground available at http://localhost:4001/graphql

## License

MIT
