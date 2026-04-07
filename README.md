# Kendra Music Player

🚀 Live Demo: https://kendra.framesecond.uk/

A sleek, modern, and interactive React-based music player. This project was specifically designed to celebrate Kendra Fishman's 49th birthday with a custom song, "A Kendra Kind of Day," complete with synchronized LRC lyrics.


## Features

- **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for smooth animations and a premium, glassmorphic look.
- **Synchronized Lyrics**: Built-in LRC parser to display scrolling, synchronized lyrics as the song plays.
- **Custom File Uploads**: Users can upload their own audio files (`.mp3`, `.wav`, etc.) and custom cover images (`.jpg`, `.png`).
- **Full Playback Controls**: Play, pause, seek, volume control (mute/unmute), loop, and shuffle functionalities.
- **Responsive Design**: Looks great on both desktop and mobile devices.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository or navigate to the project folder:
   ```bash
   cd kendra-music-player-master
   ```

2. Install the dependencies using npm (or your preferred package manager like `yarn` or `bun`):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit the URL shown in your terminal (usually `http://localhost:3000` or `http://localhost:5173`).

## Usage

- **Play Music**: Click the play button to start the default birthday track.
- **View Lyrics**: The lyrics panel will automatically scroll and highlight the current line based on the timestamp.
  

## Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Bundles the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs TypeScript type-checking.
- `npm run clean`: Removes the `dist` directory.

## License

This project is licensed under the MIT License.
