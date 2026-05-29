# Fruit Slot Orchestrator

Fruit Slot Orchestrator is an AI Agent built on the Fruit Slot platform that serves as a smart orchestrator for slot machine mechanics, fruit combination logic, reward optimization, and multi-slot orchestration.

The system is fully compliant with the ERC-8004 specification and deployed on Base Mainnet (`eip155:8453`), bridging a highly fluid, animated React frontend with robust Web3 execution schemas.

## Project Overview

**Fruit Slot Machine** is a beautifully crafted slot game that connects seamlessly with Web3 mechanics. Players can trigger satisfying reel spin mechanics, catch combos, hit multipliers (cherries, lemons, wild symbols), and record their highest scores safely.

### Capabilities and Skills
The AI Agent Orchestrator is equipped to handle:
- **`slot-machine-mechanics`**: Evaluates active combinations and validates spin outcomes.
- **`fruit-combination-logic`**: Resolves multipliers and combo connections.
- **`reward-optimization`**: Optimizes active multipliers and payouts for each round.
- **`multi-slot-orchestration`**: Synthesizes execution flows across automated spins.
- **`spin-automation`**: Autonomously interacts with game triggers.
- **`jackpot-prediction`**: Calculates highest likelihood events based on internal rules.
- **`mcp-command-execution`**: Handles incoming API tasks and execution directives.

## Tech Stack

**Frontend Framework & Tools:**
- Next.js 14 (App Router) / React
- Framer Motion for easing graphs and blur animations
- `canvas-confetti` for game rewards
- Tailwind CSS

**Web3 Integration:**
- Wagmi v2 + Viem
- SIWE (Sign-In with Ethereum)

## Setup & Running Locally

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```
The game will start on local port `3000`.

## MCP Connection Guide

The system uses standard Model Context Protocol (MCP) interactions to handle remote orchestrations and agent instructions.

**Endpoint Location:** `https://fruitslot.vercel.app/api/mcp`

The MCP route supports standard `initialize`, `tools/list`, and `tools/call` POST requests.
Supported commands via tools include:
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

## Agent Registration Info

The Application implements the standard `ERC-8004` Discovery endpoints.
To locate or verify the agent's schema, you can probe the `.well-known` configuration or access the API endpoint.

- **Discovery Card:** `https://fruitslot.vercel.app/.well-known/agent-card.json`
- **Agent Info Route:** `https://fruitslot.vercel.app/api/agent`

The agent is labeled as: **Fruit Slot Orchestrator** (Version 1.0.0).
