# Admin Node Application

## Overview
The Admin Node is a Node.js server with a Vue.js frontend that allows administrators to monitor and control Render Nodes using their private IP addresses within the same VPC.

## Features
- Input field for Render Node private IP addresses
- Real-time metrics display (CPU, GPU, Memory utilization)
- Start/Stop control buttons for Render Nodes
- Automatic polling every 5 seconds for metrics updates
- Error handling for invalid IPs and unreachable nodes

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the Admin Node server:
```bash
npm start
```

2. The server will run on port 3000 by default.

3. Use the Vue.js component `AdminDashboard.vue` in your frontend application.

## API Endpoints

- `GET /api/monitor?ip=<renderNodeIp>` - Fetch metrics from Render Node
- `POST /api/start` - Send start command to Render Node
- `POST /api/stop` - Send stop command to Render Node

## Development

For development with auto-restart:
```bash
npm run dev
```

## Files
- `admin-server.js` - Main server file
- `AdminDashboard.vue` - Vue.js component for the UI
- `package.json` - Dependencies and scripts

## Error Handling
- Validates private IP address format
- Handles network timeouts and connection errors
- Provides user-friendly error messages
