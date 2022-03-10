const router = require('express').Router();
const userRoutes = require('./user-routes');

router.use('/users', userRoutes); // adds prefix - /users

module.exports = router;