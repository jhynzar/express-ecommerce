const express = require('express');

const router = express.Router();

// Get Category List (/) GET
router.get('/', (req, res) => {

    req.app.get('databaseConnectionPromise')
        .query('SELECT id, name, is_deleted FROM category WHERE is_deleted = 0')
            .then(([rows, fields]) => {
                res.status(200).json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });

});

// Create Category (/) POST
router.post('/', (req, res) => {
    
    const { name } = req.body;

    req.app.get('databaseConnectionPromise')
        .query(
            `INSERT INTO category (name) VALUES (?)`,
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

// Read Category (/:category_id:) GET
router.get('/:id', (req, res) => {
    
    const { id } = req.params;

    req.app.get('databaseConnectionPromise')
        .query(
            `SELECT id, name, is_deleted FROM category WHERE id = ? AND is_deleted = 0`,
            [ id ]
            )
            .then(([rows, fields]) => {
                res.status(200).json(rows[0]);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    
});

// Update Category (/:category_id:) PUT
router.put('/:id', (req, res) => {
    
    const { id } = req.params;
    const { name, is_deleted } = req.body;

    req.app.get('databaseConnectionPromise')
        .query(
            `UPDATE category SET name = ?, is_deleted = ? WHERE id = ?`,
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

// Delete Category (/:category_id:) DELETE
router.delete('/:id', (req, res) => {
    
    const { id } = req.params;

    req.app.get('databaseConnectionPromise')
        .query(
            `UPDATE category SET is_deleted = 1 WHERE id = ?`,
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

// Get Items of Category Id (:id) List (/:id/items) GET
router.get('/:id/items', (req, res) => {

    const { id } = req.params;

    req.app.get('databaseConnectionPromise')
        .query(`
            SELECT item.id, item.name 
            FROM item INNER JOIN item_category on (item.id = item_category.item_id) 
            WHERE 
                item_category.category_id = ?
                AND item.is_deleted = 0
            `,
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