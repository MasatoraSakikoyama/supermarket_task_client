# Supermarket Task App

A web application built with React and Next.js for supermarket task management.

## Features

- **Summary Page**: View and manage summary data from Web API
- **Register Page**: Register new items via Web API
- **Update Page**: Update existing items via Web API
- **Delete Page**: Delete items via Web API

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for production
- [React](https://reactjs.org) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with navigation
│   ├── page.tsx          # Home page
│   ├── summary/
│   │   └── page.tsx      # Summary page
│   ├── register/
│   │   └── page.tsx      # Register page
│   ├── update/
│   │   └── page.tsx      # Update page
│   └── delete/
│       └── page.tsx      # Delete page
├── components/
│   └── Navigation.tsx    # Navigation component
└── lib/
    └── api.ts            # Web API utility functions
```

## Web API Usage

The application includes a Web API utility (`src/lib/api.ts`) with the following functions:

- `get<T>(url, headers?)` - GET request
- `post<T>(url, body, headers?)` - POST request
- `put<T>(url, body, headers?)` - PUT request
- `del<T>(url, headers?)` - DELETE request
- `patch<T>(url, body, headers?)` - PATCH request

Example usage:

```typescript
import { get, post } from '@/lib/api';

// GET request
const response = await get<DataType>('/api/endpoint');

// POST request
const response = await post<ResponseType>('/api/endpoint', { data: 'value' });
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
