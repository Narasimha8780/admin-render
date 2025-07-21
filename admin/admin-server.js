/**
 * Admin Node Server
 * - Serves API endpoints to communicate with Render Nodes via private IP
 * - Proxies metrics and control commands (start/stop)
 * - Serves the dashboard HTML file
 * - Maintains registry of connected render nodes
 */

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the dashboard at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Registry to store connected render nodes
let connectedRenderNodes = new Set();

// Regex to validate private IP addresses (IPv4)
const privateIpRegex = /^(10\.(?:[0-9]{1,3}\.){2}[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.(?:[0-9]{1,3}\.)[0-9]{1,3}|192\.168\.(?:[0-9]{1,3}\.)[0-9]{1,3})$/;

// Validate IP address format and private IP range
function isValidPrivateIp(ip) {
  return privateIpRegex.test(ip);
}

// POST /api/register - Render node registers itself with admin
app.post('/api/register', (req, res) => {
  const renderNodeIp = req.body.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }
  
  connectedRenderNodes.add(renderNodeIp);
  console.log(`Render Node registered: ${renderNodeIp}`);
  res.json({ message: 'Render Node registered successfully.' });
});

// GET /api/nodes - Get list of connected render nodes
app.get('/api/nodes', (req, res) => {
  res.json({ nodes: Array.from(connectedRenderNodes) });
});

// GET /api/monitor?ip=<renderNodeIp>
// Fetch metrics from the Render Node
app.get('/api/monitor', async (req, res) => {
  const renderNodeIp = req.query.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }

  try {
    const response = await axios.get(`http://${renderNodeIp}:4000/metrics`, { timeout: 3000 });
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch metrics from Render Node at ${renderNodeIp}.` });
  }
});

// POST /api/start
// Body: { ip: "<renderNodeIp>" }
// Send start command to Render Node
app.post('/api/start', async (req, res) => {
  const renderNodeIp = req.body.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }

  try {
    const response = await axios.post(`http://${renderNodeIp}:4000/start`, {}, { timeout: 3000 });
    return res.json({ message: `Render Node at ${renderNodeIp} started successfully.` });
  } catch (error) {
    return res.status(500).json({ error: `Failed to start Render Node at ${renderNodeIp}.` });
  }
});

// POST /api/stop
// Body: { ip: "<renderNodeIp>" }
// Send stop command to Render Node
app.post('/api/stop', async (req, res) => {
  const renderNodeIp = req.body.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }

  try {
    const response = await axios.post(`http://${renderNodeIp}:4000/stop`, {}, { timeout: 3000 });
    return res.json({ message: `Render Node at ${renderNodeIp} stopped successfully.` });
  } catch (error) {
    return res.status(500).json({ error: `Failed to stop Render Node at ${renderNodeIp}.` });
  }
});

app.listen(PORT, () => {
  console.log(`Admin Node server running on port ${PORT}`);
});
