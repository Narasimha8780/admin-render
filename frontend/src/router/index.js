import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import TLDashboard from '../components/TLDashboard.vue';
import EmployeeDashboard from '../components/EmployeeDashboard.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/tl', name: 'TLDashboard', component: TLDashboard },
  { path: '/employee', name: 'EmployeeDashboard', component: EmployeeDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
