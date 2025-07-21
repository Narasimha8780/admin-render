<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Employee Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block mb-1 font-medium">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label for="password" class="block mb-1 font-medium">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
        <div v-if="error" class="text-red-600 mt-2 text-center font-semibold">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'EmployeeLogin',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      if (!this.username || !this.password) {
        this.error = 'Please fill all fields';
        return;
      }
      this.loading = true;
      try {
        const response = await axios.post('http://serverip:3000/api/login', {
          username: this.username,
          password: this.password,
          role: 'employee',
        });
        if (response.data.role === 'employee') {
          this.$router.push('/dashboard');
        } else {
          this.error = 'Invalid role for employee login';
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
