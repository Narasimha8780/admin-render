const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/adminempdb';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});
const User = mongoose.model('User', userSchema);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Admin-Employee Management API');
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password and role are required' });
  }
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or role' });
    }
    return res.json({ username: user.username, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
