# Smart Review & Feedback Tool

## Features

- 1–5 star rating
- Context-based review generation
- Editable suggestions
- Customer feedback submission
- Admin dashboard
- Rating filters
- Needs-attention highlighting

## Tech Stack

Frontend:
- React
- Vite

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

## Setup

### Backend

cd server
npm install
npm run dev

### Frontend

cd client
npm install
npm run dev

## Environment Variables

MONGO_URI=...
PORT=5000

## Review Generation Logic

The application uses rule-based templates based on:
- rating
- business type
- service
- customer context

No external AI API is required.