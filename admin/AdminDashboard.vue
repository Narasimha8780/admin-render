<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-semibold mb-6">Admin Node Dashboard</h1>
    <div class="mb-4">
      <label for="ipInput" class="block mb-2 font-medium">Render Node Private IP:</label>
      <input
        id="ipInput"
        v-model="renderNodeIP"
        type="text"
        placeholder="Enter Render Node private IP"
        class="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
        @keyup.enter="detectRenderNode"
      />
      <button
        @click="detectRenderNode"
        class="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        :disabled="loading"
      >
        Detect Render Node
      </button>
    </div>

    <div v-if="error" class="mb-4 text-red-600 font-semibold">
      {{ error }}
    </div>

    <div v-if="metrics">
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left">Render Node IP</th>
            <th class="border border-gray-300 px-4 py-2 text-left">CPU Usage (%)</th>
            <th class="border border-gray-300 px-4 py-2 text-left">GPU Usage (%)</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Memory Utilization (%)</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 px-4 py-2">{{ renderNodeIP }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ metrics.cpuUsage.toFixed(1) }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ metrics.gpuUsage.toFixed(1) }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ metrics.memoryUtilization.toFixed(1) }}</td>
            <td class="border border-gray-300 px-4 py-2 space-x-2">
              <button
                class="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                :disabled="metrics.isRunning || loading"
                @click="startRender"
              >
                Start
              </button>
              <button
                class="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                :disabled="!metrics.isRunning || loading"
                @click="stopRender"
              >
                Stop
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const renderNodeIP = ref('');
const metrics = ref(null);
const error = ref('');
const loading = ref(false);
let pollingInterval = null;

function isValidPrivateIp(ip) {
  const privateIpRegex = /^(10\.(?:[0-9]{1,3}\.){2}[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.(?:[0-9]{1,3}\.)[0-9]{1,3}|192\.168\.(?:[0-9]{1,3}\.)[0-9]{1,3})$/;
  return privateIpRegex.test(ip);
}

async function fetchMetrics() {
  if (!isValidPrivateIp(renderNodeIP.value)) {
    error.value = 'Please enter a valid private IP address.';
    metrics.value = null;
    return;
  }
  error.value = '';
  loading.value = true;
  try {
    const response = await axios.get(`/api/monitor?ip=${renderNodeIP.value}`);
    metrics.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch metrics from Render Node.';
    metrics.value = null;
  } finally {
    loading.value = false;
  }
}

async function startRender() {
  if (!renderNodeIP.value) return;
  loading.value = true;
  error.value = '';
  try {
    await axios.post('/api/start', { ip: renderNodeIP.value });
    await fetchMetrics();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to start Render Node.';
  } finally {
    loading.value = false;
  }
}

async function stopRender() {
  if (!renderNodeIP.value) return;
  loading.value = true;
  error.value = '';
  try {
    await axios.post('/api/stop', { ip: renderNodeIP.value });
    await fetchMetrics();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to stop Render Node.';
  } finally {
    loading.value = false;
  }
}

function detectRenderNode() {
  fetchMetrics();
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(fetchMetrics, 5000);
}

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
/* Minimal styling for clean modern look */
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
}
th {
  background-color: #f3f4f6;
  font-weight: 600;
}
button:disabled {
  cursor: not-allowed;
}
</style>
