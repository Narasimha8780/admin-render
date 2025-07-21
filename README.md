# Admin and Render Node System

## Overview
This project implements a comprehensive system architecture with two main applications running within the same Virtual Private Cloud (VPC):

- **Admin Application:** A Node.js server with Vue.js frontend for monitoring and controlling Render Nodes
- **Render Application:** A Node.js server that reports system metrics and responds to control commands

## Project Structure

```
├── admin/                    # Admin Node Application
│   ├── admin-server.js      # Main server file
│   ├── AdminDashboard.vue   # Vue.js UI component
│   ├── package.json         # Dependencies and scripts
│   └── README.md           # Admin-specific documentation
├── render/                  # Render Node Application
│   ├── render-server.js    # Main server file
│   ├── package.json        # Dependencies and scripts
│   └── README.md          # Render-specific documentation
└── README.md              # This file
```

## Quick Start

### 1. Setup Admin Application

```bash
cd admin
npm install
npm start
```

The Admin Node will run on port 3000.

### 2. Setup Render Application

```bash
cd render
npm install
npm start
```

When prompted, enter the Admin Node's private IP address.
The Render Node will run on port 4000.

## System Architecture

```
┌─────────────────────────┐
│   Admin Node (Port 3000) │
│   - Vue.js Frontend      │
│   - Node.js API Server  │
└─────────┬───────────────┘
          │ HTTP Requests
          │ (Private IP)
┌─────────▼───────────────┐
│  Render Node (Port 4000) │
│  - Metrics Reporting    │
│  - Command Processing   │
└─────────────────────────┘
```

## Features

### Admin Application
- Input field for Render Node private IP addresses
- Real-time metrics monitoring (CPU, GPU, Memory)
- Start/Stop control buttons
- Automatic polling every 5 seconds
- Error handling and validation

### Render Application
- System metrics reporting
- Start/Stop command processing
- Private IP validation
- Real-time metric generation

## Communication Protocol

All communication happens over HTTP using private IP addresses within the VPC:

- **Admin → Render:** Control commands and metric requests
- **Render → Admin:** Metric responses and status updates

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- Network setup allowing communication between nodes via private IPs

## Testing

1. Start both applications as described in Quick Start
2. Open the Admin UI and enter a Render Node IP
3. Verify metrics display and control buttons work
4. Test error scenarios (invalid IPs, unreachable nodes)

## Security Considerations

- Only private IP addresses are accepted
- Input validation on all endpoints
- Error handling prevents information disclosure
- Designed for VPC-internal communication only

## License

MIT License

## Support

For detailed documentation on each application, see:
- [Admin Application README](./admin/README.md)
- [Render Application README](./render/README.md)
