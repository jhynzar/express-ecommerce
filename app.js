// App Entry point
require('dotenv').config();

const express = require('express');

const databaseConnection = require('./database');
const initializeRoutes = require('./routes');

const app = express();
const PORT = 3000;

// Assign Database
app.set('databaseConnection', databaseConnection);

// Routes
initializeRoutes(app);

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});