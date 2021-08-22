const express = require('express');

const router = express.Router();

// Get Item List (/) GET
router.get('/', (req, res) => {

    req.app.get('databaseConnectionPromise')
        .query('SELECT id, name, is_deleted FROM item WHERE is_deleted = 0')
            .then(([rows, fields]) => {
                res.status(200).json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });

});

// Create Item (/) POST
router.post('/', (req, res) => {
    
    const { name } = req.body;

    req.app.get('databaseConnectionPromise')
        .query(
            `INSERT INTO item (name) VALUES (?)`,
            [ name ]
            )
            .then(([rows, fields]) => {
                res.status(200).json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    
});

// Read Item (/:item_id:) GET
router.get('/:id', (req, res) => {
    
    const { id } = req.params;

    req.app.get('databaseConnectionPromise')
        .query(
            `SELECT id, name, is_deleted FROM item WHERE id = ? AND is_deleted = 0`,
            [ id ]
            )
            .then(([rows, fields]) => {
                res.status(200).json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    
});

// Update Item (/:item_id:) PUT
router.put('/:id', (req, res) => {
    
    const { id } = req.params;
    const { name, is_deleted } = req.body;

    req.app.get('databaseConnectionPromise')
        .query(
            `UPDATE item SET name = ?, is_deleted = ? WHERE id = ?`,
            [ name, is_deleted, id ]
            )
            .then(([rows, fields]) => {
                res.status(200).json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    
});

// Delete Item (/:item_id:) DELETE
router.delete('/:id', (req, res) => {
    
    const { id } = req.params;

    req.app.get('databaseConnectionPromise')
        .query(
            `UPDATE item SET is_deleted = 1 WHERE id = ?`,
            [ id ]
            )
            .then(([rows, fields]) => {
                res.status(200).json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    
});

// Export
module.exports = router;