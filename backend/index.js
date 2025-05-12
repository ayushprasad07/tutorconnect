const connectToMongo = require("./db");
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express();
const port = 4000;

app.use(cors());

// ✅ Apply body parser middleware BEFORE routes
app.use(express.json({ limit: '10mb' }));

// Routes (must come after express.json())
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/upload', require('./routes/upload'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
