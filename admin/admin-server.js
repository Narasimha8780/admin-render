/**
 * Admin Node Server
 */

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let connectedRenderNodes = new Set(['10.5.0.5']); // Add initial IP or use /api/register

const privateIpRegex = /^(10\.(?:[0-9]{1,3}\.){2}[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.(?:[0-9]{1,3}\.)[0-9]{1,3}|192\.168\.(?:[0-9]{1,3}\.)[0-9]{1,3})$/;

function isValidPrivateIp(ip) {
  return privateIpRegex.test(ip);
}

app.post('/api/register', (req, res) => {
  const renderNodeIp = req.body.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }

  connectedRenderNodes.add(renderNodeIp);
  console.log(`Render Node registered: ${renderNodeIp}`);
  res.json({ message: 'Render Node registered successfully.' });
});

app.get('/api/nodes', (req, res) => {
  res.json({ nodes: Array.from(connectedRenderNodes) });
});

app.get('/api/monitor', async (req, res) => {
  const renderNodeIp = req.query.ip;
  if (!renderNodeIp) {
    return res.status(400).json({ error: 'Missing Render Node IP address.' });
  }

  try {
    console.log(`Fetching metrics from Render Node at ${renderNodeIp}...`);
    const response = await axios.get(`http://${renderNodeIp}:4000/metrics`, { timeout: 7000 });
    console.log(`Metrics received from ${renderNodeIp}:`, response.data);
    return res.json(response.data);
  } catch (error) {
    console.error(`Error fetching metrics from ${renderNodeIp}: ${error.message} | Code: ${error.code} | Status: ${error.response?.status}`);
    return res.status(500).json({
      cpu: null,
      gpu: null,
      memory: null,
      status: 'unreachable',
      error: `Failed to reach render node at ${renderNodeIp}`,
    });
  }
});

app.post('/api/start', async (req, res) => {
  const renderNodeIp = req.body.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }

  try {
    await axios.post(`http://${renderNodeIp}:4000/start`, {}, { timeout: 7000 });
    return res.json({ message: `Render Node at ${renderNodeIp} started successfully.` });
  } catch (error) {
    console.error(`Error starting Render Node at ${renderNodeIp}: ${error.message}`);
    return res.status(500).json({ error: `Failed to start Render Node at ${renderNodeIp}.` });
  }
});

app.post('/api/stop', async (req, res) => {
  const renderNodeIp = req.body.ip;
  if (!renderNodeIp || !isValidPrivateIp(renderNodeIp)) {
    return res.status(400).json({ error: 'Invalid or missing Render Node private IP address.' });
  }

  try {
    await axios.post(`http://${renderNodeIp}:4000/stop`, {}, { timeout: 7000 });
    return res.json({ message: `Render Node at ${renderNodeIp} stopped successfully.` });
  } catch (error) {
    console.error(`Error stopping Render Node at ${renderNodeIp}: ${error.message}`);
    return res.status(500).json({ error: `Failed to stop Render Node at ${renderNodeIp}.` });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Admin Node server running on http://localhost:${PORT}`);
});
