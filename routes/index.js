const router = require('express').Router();
const apiRoutes = require('./api'); // import all api routes

router.use('/api', apiRoutes); // adds prefix - /api

router.use((req, res) => {
    res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;
