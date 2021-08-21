// Initialize Routes
module.exports = (app) => {

    // Categories
    app.use('/api/categories', require('./api/categories'));
    // Items
    app.use('/api/items', require('./api/items'));

};