/**
 * Render Node Server
 * - Prompts for Admin Node private IP on startup
 * - Exposes endpoints for metrics reporting and start/stop commands
 */

const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const readline = require('readline');
const axios = require('axios');

const app = express();
const PORT = 4000;
const HOST = '0.0.0.0'; // Listen on all interfaces

app.use(bodyParser.json());

let adminNodeIp = '';
let isRunning = false;

// Function to get the first private IPv4 address of this machine
function getPrivateIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Check if IP is private
        if (/^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(iface.address)) {
          return iface.address;
        }
      }
    }
  }
  return '0.0.0.0';
}

// Simulate CPU usage percentage (0-100)
function getCpuUsage() {
  // For demo, generate random usage between 10 and 90
  return Math.random() * 80 + 10;
}

// Simulate GPU usage percentage (0-100)
function getGpuUsage() {
  // For demo, generate random usage between 5 and 70
  return Math.random() * 65 + 5;
}

// Calculate memory utilization percentage
function getMemoryUtilization() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  return ((totalMem - freeMem) / totalMem) * 100;
}

// GET /metrics - returns current metrics and status
app.get('/metrics', (req, res) => {
  try {
    const metrics = {
      renderNodeIp: getPrivateIp(),
      cpuUsage: getCpuUsage(),
      gpuUsage: getGpuUsage(),
      memoryUtilization: getMemoryUtilization(),
      isRunning,
    };
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve metrics.' });
  }
});

// POST /start - start rendering process
app.post('/start', (req, res) => {
  if (isRunning) {
    return res.status(400).json({ error: 'Render Node is already running.' });
  }
  isRunning = true;
  res.json({ message: 'Render Node started successfully.' });
});

// POST /stop - stop rendering process
app.post('/stop', (req, res) => {
  if (!isRunning) {
    return res.status(400).json({ error: 'Render Node is not running.' });
  }
  isRunning = false;
  res.json({ message: 'Render Node stopped successfully.' });
});

// Function to register with Admin Node
async function registerWithAdmin(adminIp, renderIp) {
  try {
    const response = await axios.post(`http://${adminIp}:3000/api/register`, {
      ip: renderIp
    });
    console.log(`Successfully registered with Admin Node: ${response.data.message}`);
  } catch (error) {
    console.error(`Failed to register with Admin Node: ${error.message}`);
  }
}

// Prompt for Admin Node IP on startup
function promptAdminNodeIp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter Admin Node private IP address: ', async (answer) => {
    const ip = answer.trim();
    // Relaxed IP validation to allow any IPv4 address for testing
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
    if (!ipv4Regex.test(ip)) {
      console.error('Invalid IPv4 address. Please restart and enter a valid IP.');
      process.exit(1);
    }
    adminNodeIp = ip;
    console.log(`Admin Node IP set to: ${adminNodeIp}`);
    rl.close();
    

app.listen(PORT, HOST, async () => {
  console.log(`Render Node server running on ${HOST}:${PORT}`);
  const renderNodeIp = getPrivateIp();
  console.log(`Render Node IP: ${renderNodeIp}`);
  
  // Register with Admin Node
  await registerWithAdmin(adminNodeIp, renderNodeIp);
});
  });
}

promptAdminNodeIp();
