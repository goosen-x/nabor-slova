# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using:
- TypeScript with strict mode enabled
- React 19.1.0
- Tailwind CSS v4 with PostCSS
- Biome for linting and formatting (instead of ESLint/Prettier)
- Turbopack for faster builds

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build the application
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Format code
npm run format
```

## Project Structure

- `app/` - Next.js App Router directory containing pages and layouts
- `public/` - Static assets
- TypeScript path alias: `@/*` maps to root directory

## Code Standards

- Biome is configured for both linting and formatting
- 2 spaces for indentation
- Next.js and React recommended rules are enabled
- Git integration is enabled for Biome

## Architecture Notes

- Uses Next.js App Router (not Pages Router)
- Root layout in `app/layout.tsx` configures Geist fonts
- Global styles in `app/globals.css`
- Tailwind CSS v4 with PostCSS configuration