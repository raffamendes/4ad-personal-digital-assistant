# 4AD Digital Character Sheet & Expedition Manager

A thematic digital assistant for the tabletop RPG **Four Against Darkness** (and its Expanded Edition). This application allows players to manage their hero vault, assemble parties, and track real-time progress during dungeon crawls.

## 🏰 Purpose

The purpose of this app is to replace paper sheets with a highly thematic, mobile-responsive digital dashboard. It streamlines the "bookkeeping" aspect of 4AD, allowing you to focus on the adventure while keeping your heroes' stats, spells, and equipment organized and persistent.

## ⚔️ Features

- **Thematic Medieval UI**: Designed with a "parchment and leather" aesthetic using medieval typography and responsive layouts.
- **Hero Vault**: Create and store an unlimited number of characters with support for Expanded Edition traits.
- **Class Portraits**: Automatically assigns character portraits based on the chosen class (e.g., Warrior, Cleric, Rogue).
- **Party Assembly**: Select up to 4 heroes from your vault to embark on a specific expedition.
- **Active Expedition Dashboard**:
    - **Real-time Stat Tracking**: Quick +/- buttons for HP, XP, Gold, and Clues for the entire party on one screen.
    - **Spell Slot Management**: Visual checkbox system to track spell/blessing uses per adventure.
    - **Live Journaling**: Update equipment and session notes for all party members simultaneously.
- **User Authentication**: Simple login system to keep your hero vault private.
- **Redis Persistence**: Fast and reliable data storage using Redis Hashes.
- **Multi-Device Support**: Optimized for tablets and phones, accessible over your local Wi-Fi network.

## 🚀 Getting Started (Docker Compose)

The easiest way to run the application is using Docker, which bundles the React frontend, Quarkus backend, and Redis database together.

### Prerequisites
- Docker and Docker Compose installed.

### Execution

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/4ad-digital-character-sheet.git
   cd 4ad-digital-character-sheet
   ```

2. **Launch the stack**:
   ```sh
   docker compose up --build -d
   ```

3. **Access the App**:
   - Open your browser and go to: `http://localhost:8080`

4. **Create your first user**:
   Since the database starts empty, register your initial user via a simple API call:
   ```sh
   curl -X POST http://localhost:8080/auth/register \
        -H "Content-Type: application/json" \
        -d '{"username": "adventurer", "password": "password123"}'
   ```

## 🛠️ Tech Stack

- **Backend**: Quarkus (Java 21), RESTEasy Reactive, Redis Client.
- **Frontend**: React 18, Vite, React Router.
- **Persistence**: Redis (OSS).
- **Styling**: Pure CSS3 with MedievalSharp and Pirata One Google Fonts.

---
*Note: This is a fan-made digital assistant. Four Against Darkness is a game by Andrea Sfiligoi.*
