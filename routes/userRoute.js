const express = require('express');
const router = express.Router();
const {register, login, me} = require('../controllers/UserController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

router.post('/register', register).post('/login', login);
router.get('/getme', auth,isAdmin, me);

module.exports = router;