# WealthFlow - Investment & Referral Management Platform

## Project Overview
WealthFlow is a MERN Stack backend project for investment, ROI, wallet, and referral income management.

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- node-cron
- Postman

## Backend Features
- User Registration
- User Login
- JWT Protected Routes
- Create Investment
- View Investments
- Dashboard Summary
- Direct Referrals
- Referral Tree
- ROI History
- Daily ROI Cron Job
- Referral Income Distribution
- Wallet Summary
- Wallet Transactions
- User Profile
- All Users
- Update Investment Status

## API Endpoints

### Authentication APIs

POST /api/auth/register

POST /api/auth/login

### User APIs

GET /api/users/profile

GET /api/users

### Investment APIs

POST /api/investments

GET /api/investments/my

GET /api/investments/all

GET /api/investments/:id

PATCH /api/investments/:id/status

### Dashboard APIs

GET /api/dashboard

### Referral APIs

GET /api/referrals/direct

GET /api/referrals/tree

GET /api/referral-income/history

### ROI APIs

GET /api/roi/history

POST /api/roi/sample

GET /api/roi/run

### Wallet APIs

GET /api/wallet

GET /api/wallet/transactions