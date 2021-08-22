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
                res.status(200).json(rows[0]);
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

// Get Categories of Item Id (:id) List; (/:id/categories) GET
router.get('/:id/categories', (req, res) => {

    const { id } = req.params;

    req.app.get('databaseConnectionPromise')
        .query(`
            SELECT category.id, category.name 
            FROM category INNER JOIN item_category on (category.id = item_category.category_id) 
            WHERE 
                item_category.item_id = ?
                AND category.is_deleted = 0
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

// Create Categories of Item Id (:item_id) (1:x , item:category); (/:item_id/categories) POST
router.post('/:item_id/categories', (req, res) => {
    
    const { item_id } = req.params;
    const { category_ids } = req.body;

    // Map Data for Query
    const dataMap = category_ids.map((category_id) => {
        return [ item_id, category_id ];
    }).flat();

    // Map Query for Multiple Inserts
    const queryValueMap = category_ids.map(() => '(?, ?)').join(', ');
    const query = `INSERT INTO item_category (item_id, category_id) VALUES ${queryValueMap}`;

    req.app.get('databaseConnectionPromise')
        .query(
            query,
            dataMap
        )
        .then(([rows, fields]) => {
            res.status(200).json(rows);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    
});

// Delete Categories of Item Id (:item_id) (1:x , item:category); (/:item_id/categories) POST
router.delete('/:item_id/categories', (req, res) => {
    
    const { item_id } = req.params;
    const { category_ids } = req.body;

    // Map Data for Query
    const dataMap = [ item_id, category_ids ].flat();

    // Map Query for Multiple Inserts
    const queryValueMap = category_ids.map(() => '?').join(', ');
    const query = `DELETE FROM item_category WHERE item_id = ? AND category_id IN (${queryValueMap})`;

    req.app.get('databaseConnectionPromise')
        .query(
            query,
            dataMap
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