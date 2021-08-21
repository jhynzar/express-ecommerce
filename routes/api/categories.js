const express = require('express');

const router = express.Router();

// Temporary Model
const categories = [
    {
        id: 1,
        name: 'Groceries'
    },
    {
        id: 2,
        name: 'Cars'
    },
    {
        id: 3,
        name: 'School Supplies'
    },
];

// Get Categories
router.get('/', (req, res) => {
    res.json(categories);
});

// Export
module.exports = router;