# Render Node Application

## Overview
The Render Node is a Node.js server that reports system metrics and responds to start/stop commands from the Admin Node. It communicates over private IP addresses within the same VPC.

## Features
- Prompts for Admin Node private IP on startup
- Reports CPU, GPU, and memory usage metrics
- Responds to start/stop rendering commands
- Validates Admin Node IP address
- Real-time metric generation and reporting

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. Navigate to the render directory:
```bash
cd render
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the Render Node server:
```bash
npm start
```

2. When prompted, enter the Admin Node's private IP address.

3. The server will run on port 4000 and be ready to receive commands from the Admin Node.

## API Endpoints

- `GET /metrics` - Returns current system metrics and operational status
- `POST /start` - Starts the rendering process
- `POST /stop` - Stops the rendering process

## Metrics Reported

- **Render Node IP**: Automatically detected private IP address
- **CPU Usage**: Simulated CPU usage percentage (10-90%)
- **GPU Usage**: Simulated GPU usage percentage (5-70%)
- **Memory Utilization**: Real memory usage based on system stats
- **Running Status**: Boolean indicating if rendering is active

## Development

For development with auto-restart:
```bash
npm run dev
```

## Files
- `render-server.js` - Main server file
- `package.json` - Dependencies and scripts

## Error Handling
- Validates Admin Node IP address format
- Prevents redundant start/stop operations
- Provides descriptive error messages for API responses

## Testing

Test the endpoints using curl or Postman:

```bash
# Get metrics
curl http://<render-node-ip>:4000/metrics

# Start rendering
curl -X POST http://<render-node-ip>:4000/start

# Stop rendering
curl -X POST http://<render-node-ip>:4000/stop
