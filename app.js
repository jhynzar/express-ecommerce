// App Entry point
const express = require('express');

const initializeRoutes = require('./routes');

const app = express();
const PORT = 3000;

// Routes
initializeRoutes(app);

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});