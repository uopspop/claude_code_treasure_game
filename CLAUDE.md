# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Interactive Treasure Box Game built with React, TypeScript, and Vite. It's a simple game where players click on treasure chests to discover either treasure (worth +$100) or skeletons (worth -$50).

## Development Commands

- `npm run dev` - Start development server on port 3000 (auto-opens browser)
- `npm run build` - Build the project for production (outputs to `build/` directory)  
- `npm install` - Install dependencies

Note: This project doesn't have separate lint, test, or typecheck commands - all validation is handled by Vite/TypeScript during build.

## Architecture

### Core Structure
- **Entry Point**: `src/main.tsx` renders the main App component
- **Main Game Logic**: `src/App.tsx` contains all game state and logic
- **UI Components**: `src/components/ui/` contains shadcn/ui components
- **Assets**: 
  - `src/assets/` - Game images (treasure chests, key cursor icon)
  - `src/audios/` - Sound effects for chest opening

### Key Features
- **Game State Management**: Uses React useState hooks for boxes, score, and game state
- **Animation**: Motion library for smooth chest opening animations and hover effects
- **Responsive Design**: Tailwind CSS for styling with mobile-first approach
- **Asset Loading**: Custom Vite aliases for Figma asset imports (`figma:asset/` prefix)

### Technical Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin for fast compilation
- **Styling**: Tailwind CSS (auto-generated in index.css)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Animation**: Motion (previously Framer Motion)

### File Structure Pattern
- Game logic concentrated in single App.tsx file
- UI components follow shadcn/ui patterns in `src/components/ui/`
- Assets organized by type (images in `assets/`, audio in `audios/`)
- Vite config handles asset aliases and build configuration

### Asset System
The project uses a custom asset system with Figma integration:
- Images imported via `figma:asset/filename.png` syntax  
- Vite config maps these to actual file paths in `src/assets/`
- Sound files referenced directly from `src/audios/`
- Assets include: treasure chest images, key cursor icon, and sound effects for chest opening

### Game Mechanics
- 3 treasure chests per game, one randomly contains treasure
- Click to open chests (animation plays)
- Score tracking: +$100 for treasure, -$50 for skeleton
- Game ends when treasure found or all chests opened
- Reset functionality to start new game
- add comments on the top of every new function with the input and output parameters documented.
- add comments on the top of every new function in one line to summarize the usage