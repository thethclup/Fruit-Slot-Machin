# Fruit Slot Orchestrator

A fully-immersive mobile-first classic fruit slot machine game built with React, Framer Motion, and Wagmi/Viem. Provides juicy animations, and real on-chain capability for ERC-8004 and ERC-8021 standards on Base Mainnet.

## Overview
**Fruit Slot Machine** is a beautifully crafted slot game that connects seamlessly with Web3. Players can trigger satisfying reel spin mechanics, catch combos, hit multipliers (cherries, lemons, wild symbols) and record their biggest achievements transparently onto the blockchain.

### Key Game Systems
- **Fluid & Juicy Animations:** Custom easing graphs and high performance blur transitions during spins.
- **Rewarding Combinations:** Matching combos string together multipliers. Highest combination pays out for the Wild 🌟 block.
- **Hybrid Leaderboard:** View the top performing players on our "Luckiest Fruit Slot Players" board.
- **Win Verification:** Integration with ERC-8021 allows true builder & source attribution for big wins sent from the UI.
- **Smart Orchestration:** Included ERC-8004 components via `/.well-known/agent-card.json` and active API schemas at `/api/agent` and `/api/mcp` for automation interoperability and execution. 

### Configuration & Deployment
- The game is set up to natively interact with Base (`eip155:8453`).
- **Attribution & Core Wallet Requirements:**
  - AI Agent / Owner Wallet: `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`
  - Builder Code: `bc_ee3cipj7`

### Technical Specs
- **Frontend Core:** React, `motion`, `canvas-confetti`, Tailwind CSS
- **Smart Integration:** Wagmi v2 + Viem, SIWE transactions
- **Backend / Orchestrator API:** Express JS runtime configured to map `MCP` and `Agent` logic.

### Endpoints
- **Agent Discovery:** `/.well-known/agent-card.json`
- **Agent Info Endpoint:** `/api/agent` (GET)
- **MCP Action Gateway:** `/api/mcp` (GET / POST)

Have fun spinning!
