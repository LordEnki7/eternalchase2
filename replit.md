# replit.md

## Overview

This project is a Young Adult sci-fi romance thriller web application showcasing the "Eternal Chase" trilogy. It functions as an immersive, cinematic one-page scroll website, serving as a multiverse portal into a cosmic romance story universe. Key capabilities include a comprehensive trilogy showcase with full audiobook integration, interactive character galleries with 3D flip animations, cosmic lore sections, enhanced e-commerce functionality for audiobooks and cosmic merchandise, and revolutionary dynamic theme song integration. The business vision is to provide a complete digital experience combining storytelling, character interaction, and e-commerce within a cosmic-themed universe, with a strong emphasis on the audiobook trilogy, high-quality visual presentation, and immersive audio experiences.

## User Preferences

Preferred communication style: Simple, everyday language.
Backup Policy: Create zip files for project portability to other platforms.

## Recent Changes

**March 11, 2026 - Self-Hosted Docker Deployment Preparation**
- Copied all static media assets (images, book covers, MP3s, MP4s) to `client/public/media/` with clean filenames
- Converted every `import x from '@assets/...'` in all frontend files to plain `const x = '/media/...'` URL strings:
  - character-gallery.tsx, ShopPlaceholders.tsx, ThemeSongController.tsx, DynamicThemeController.tsx
  - InteractiveStarMap.tsx, StarMapBackground.tsx, trilogy-showcase.tsx, cosmic-shop.tsx
  - bookstore.tsx, trilogy.tsx, young-adult.tsx, home.tsx, resonance-raiders.tsx
  - lib/character-data.ts (fixed broken root-level imports), lib/aiyanna-character-data.ts
- Fixed `server/replitAuth.ts`: no longer throws on missing `REPLIT_DOMAINS`; auth silently disabled when not on Replit
- Created `Dockerfile` (multi-stage Node 20 Alpine build)
- Created `docker-compose.yml` with app + Postgres + attached_assets volume mount
- Created `.dockerignore` and `.env.example`
- Updated `.gitignore` to exclude .env files and zip archives
- Note: WAV audiobook files stay in `attached_assets/` served via `/attached_assets/` Express route (mounted as Docker volume)

**March 11, 2026 - AI Agent Command Center**
- Built complete AI Agent infrastructure system integrated into Admin Dashboard (protected by existing admin password)
- Added 5 new database tables: agents, agent_assignments, agent_jobs, execution_runs, agent_memory
- Auto-seeded 6 specialized agents: Ecosystem Orchestrator, Growth Engine, Revenue Generator, Community Guardian, Development Scout, Memory Keeper
- Agent Command Center tab in /admin with: Daily Executive Brief, Agent Registry with status controls, Approval Queue for task proposals, Execution History, and shared Agent Memory Bank
- Full REST API: /api/agents, /api/agent-jobs, /api/execution-runs, /api/agent-memory, /api/agent-command/daily-brief
- Admins can propose tasks, approve/reject them, store insights into agent memory, and control agent status

**January 18, 2026 - Mobile & Performance Enhancements**
- Added PWA service worker for offline caching of static assets and audio files
- Created mobile navigation menu with hamburger icon for smaller screens
- Added skip-to-content accessibility link for keyboard navigation
- Improved touch-friendly navigation with proper ARIA labels
- Service worker caches audio files for offline playback

**January 17, 2026 - Major Enhancement Update: User Engagement & Social Features**
- **Cosmic Profile System**: New user profile page with XP tracking, level progression, cosmic titles, and personalized badges
- **Achievement System**: 12 achievements across reading, exploration, game, and community categories with XP rewards
- **Leaderboard System**: Competitive rankings for Resonance Raiders game with score submission and tracking
- **Community Lore**: User-generated content system for sharing theories, world-building, and fan stories with upvoting
- **Daily Cosmic Signals**: Daily engagement feature with streak tracking and XP bonuses
- **Narrative Quests**: Quest system with daily, weekly, and story quests for guided progression
- **Interactive Star Map**: 7 explorable nodes with discoverable story content
- **Seasonal Events**: Event system with milestones and special rewards (Starfall Festival active)
- **Security Improvements**: Added authentication and Zod validation to new user engagement mutation endpoints (quests, achievements, starmap, events, lore, signals, profile, leaderboard)
- **PWA Support**: Added manifest.json for progressive web app capabilities
- **New Routes**: /profile, /leaderboard, /community pages with full navigation
- **Database Schema**: Added 14 new tables for user progression, achievements, leaderboards, quests, and events

**August 8, 2025 - Resonance Raiders 3D Implementation Complete**
- Successfully converted Resonance Raiders from 2D to fully functional 3D using Three.js
- Resolved critical timing bug: 3D scene initialization now occurs after game start button press
- Created immersive tropical island environment with sandy beaches, palm trees, and crystal formations
- Implemented rotating purple and cyan resonance crystals with proper 3D positioning
- Added comprehensive lighting system with ambient and directional shadows
- Built manual canvas creation system to bypass React DOM management issues
- Game features: WASD movement, 3D camera following, crystal collection mechanics
- Scene persists correctly without disappearing after entering the game world
- Enhanced with debug monitoring and visibility tracking systems
- Island design based on user-provided 3D tropical island reference imagery

**January 3, 2025 - Complete Character Video Integration & Layout System**
- Successfully implemented video support for ALL 7 characters: Aiyanna, Paisley, Tariq, Zarek, IXORA, Vera, and Elena
- Fixed video integration issue by identifying local CharacterCard component in young-adult.tsx
- Added hover-to-play video functionality with automatic pause/reset on mouse leave
- Standardized all cards to uniform 580px height with optimized text sizing
- Enhanced video area to 380px with object-contain for full upper body visibility
- Fixed all text overflow issues with proper font sizing and section heights
- Added scrollable story sections and line-clamp for quotes
- Fixed Cosmic Threads theme music stop functionality with userStopped state management
- All character videos display as thumbnails with seamless hover interaction
- Video files: Young Aiyanna waving, Paisley Animation, Tariq Animation, Zarek animation, IXORA animation, Vera animation, Elena Mercer animation

**January 2, 2025 - Theme Music System Implementation**
- Implemented intelligent DynamicThemeController for automatic theme switching
- Fixed theme music conflicts between Cosmic Hearts Align and Cosmic Threads
- Added auto-start functionality on main page load
- Integrated with global audio system to pause during audiobook playbook
- Theme songs now never play simultaneously
- Backup created: eternal-chase-theme-music-working-[timestamp].zip
  - Use 'eternal-chase-complete-backup.zip' format for consistent naming
  - Exclude node_modules, dist, package-lock.json, migrations, .git, logs, cache
  - Include complete source code, all assets, documentation, and configuration files
  - Complete project backup with character cards and book covers included
  - Automated backup script available: ./create-backup.sh

## System Architecture

The application follows a modern full-stack architecture designed for immersive storytelling and e-commerce.

-   **Frontend**: React 18 with TypeScript, styled using TailwindCSS and shadcn/ui components. Features a Single-Page Application (SPA) using Wouter for routing, shadcn/ui components with Radix UI primitives, TailwindCSS with custom cosmic theme variables and animations, TanStack Query for server state, and custom hook-based internationalization (English/Spanish). Interactive 3D flip cards for characters and comprehensive book showcases with audiobook features are central.
-   **Backend**: Express.js server with TypeScript. Provides a RESTful API with middleware for logging and error handling, supporting newsletter subscriptions, purchase management, and transaction status updates.
-   **Database**: PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes Users, Newsletters, and Purchases tables with proper foreign key relationships to manage user authentication, email subscriptions, and e-commerce transactions (audiobooks, digital art, merchandise).
-   **Build System**: Vite for fast development and optimized production builds.
-   **Deployment**: Node.js production server with static file serving. Vite builds the optimized React application, and esbuild bundles the Express server. Drizzle migrations are stored in `./migrations`.

**Key Architectural Decisions:**

-   **Type-safe Database Operations**: Implemented Drizzle ORM with PostgreSQL for robust TypeScript integration and schema management.
-   **Consistent Styling & Theming**: Utilizes TailwindCSS with custom CSS variables to maintain a consistent cosmic theme and support dark mode.
-   **Server-side State Management**: Employs TanStack Query for efficient API integration, handling caching, background updates, and error states.
-   **Internationalization**: Custom React hooks with localStorage persistence provide lightweight bilingual support for English/Spanish content.
-   **Visual Enhancements**: Extensive use of hardware acceleration (translate3d(), will-change) for smooth animations, reduced transition durations, and optimized starfield effects. Page transitions use fade-in and scale animations. Character galleries use staggered animations.
-   **Interactive Elements**: Features interactive 3D flip character cards, an interactive Star Map of Galaxy Altherra with clickable locations and dynamic visual effects, UI sound effects using Web Audio API for interactive feedback, and revolutionary dynamic theme song system with context-aware music switching.
-   **Dynamic Theme Song System**: Intelligent music controller that automatically switches between "Cosmic Hearts Align" (main trilogy) and "Cosmic Threads" (Young Adult section) based on user navigation. Features real-time audio visualizer, expandable player interface, volume controls, progress seeking, manual theme switching, seamless transitions, and complete bilingual support.
-   **Content Organization**: Dedicated Young Adult section for prequel stories, separating it from the main trilogy. Comprehensive organized audiobook file structure with dedicated folders per book (`audiobooks/english/book1-eternal-chase/`, `book2-spiral-galaxy/`, `book3-ascensions-edge/`, `series-intros/`, `young-adult/`) to prevent file misplacement. Asset folders are logically structured (`audiobooks/`, `characters/`, `book-covers/`, `images/`, `documents/`).
-   **Bundle Size Monitoring**: Implemented a strict 500KB bundle size limit by excluding assets from the build, serving them directly from the server via middleware.

## External Dependencies

-   **React Ecosystem**: React, React DOM, TanStack Query.
-   **UI Components**: shadcn/ui, Radix UI.
-   **Styling**: TailwindCSS, class-variance-authority.
-   **Forms**: React Hook Form, Hookform resolvers.
-   **Database**: Drizzle ORM, Neon Database serverless adapter.
-   **Validation**: Zod.
-   **Build Tools**: Vite, esbuild.
-   **Database Tools**: Drizzle Kit.
-   **Runtime**: tsx.
-   **Authentication**: Replit OAuth for sign-in/sign-out.
-   **Payment Processing**: Stripe for $9.99/month subscription system.