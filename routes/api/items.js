const express = require('express');

const router = express.Router();

// Temporary Model
const items = [
    {
        id: 1,
        categoryid: 1,
        name: 'Eggs'
    },
    {
        id: 2,
        categoryid: 2,
        name: 'Honda'
    },
    
    {
        id: 3,
        categoryid: 3,
        name: 'Pencil1'
    },
    {
        id: 4,
        categoryid: 3,
        name: 'Pencil2'
    },
];

// Get Items
router.get('/', (req, res) => {
    res.json(items);
});

// Export
module.exports = router;