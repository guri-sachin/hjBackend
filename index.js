// index.js
const express = require('express');
const bodyParser = require('body-parser');
const uploadRoutes = require('./routes');
const cors = require('cors'); 



const app = express();
const port = 4000;

// Middleware
app.use(cors()); // Use cors middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', uploadRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
