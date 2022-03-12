const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

router.use('/users', userRoutes); // adds prefix - /users
router.use('/thoughts', thoughtRoutes); // adds prefix -/thoughts

module.exports = router;