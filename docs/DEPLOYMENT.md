
# Deployment Guide

## Prerequisites
- Node.js v20+
- PostgreSQL Database
- Redis (optional, for scalable WebSockets)

## Environment Variables
Ensure both `.env.production` (Frontend) and `backend/.env.production` (Backend) are correctly populated.

## Backend Deployment
1. `cd backend`
2. `npm ci`
3. `npx prisma migrate deploy`
4. `npm run build`
5. `npm run start:prod` (Using PM2 or Docker is recommended)

## Frontend Deployment (Vercel/Next.js)
1. Set up project on Vercel.
2. Build command: `npm run build`
3. Output directory: `.next`
4. Ensure `NEXT_PUBLIC_API_URL` points to the production backend URL.
