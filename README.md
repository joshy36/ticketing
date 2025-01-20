# Ticketing Platform

A modern, full-stack ticketing platform built with Next.js, featuring web, mobile, and dashboard applications. The platform supports NFT-based tickets, event management, and secure ticket verification.

## Project Structure

This is a monorepo managed with Turborepo containing:

### Applications

- **web**: Main Next.js web application
- **mobile**: React Native mobile app using Expo
- **dashboard**: Admin dashboard Next.js application

### Packages

- **chain**: Smart contracts and blockchain integration
- **api**: Shared API layer using tRPC
- **supabase**: Database types and utilities
- **k6**: load testing suite

## Technology Stack

### Frontend
- Next.js 14 with App Router
- React Native (Expo) for mobile
- TailwindCSS with shadcn/ui components
- TypeScript

### Backend
- Supabase for database and authentication

### Database/Auth/File Hosting
- [Supabase](https://supabase.com/)

### Blockchain
- Hardhat for smart contract development
- ERC721A for NFT contracts
- Base (Sepolia/Goerli) network support

### Testing & Quality
- Playwright for E2E testing
- Jest for unit testing
- Prettier for code formatting

## Getting Started

1. Install dependencies:
```bash
npm install