const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');
const auth = require('../authentification/auth');

router.post('/signup', auth, UserCtrl.signup);
router.post('/login', UserCtrl.login);
router.get('/', auth, UserCtrl.getAllUsers);
router.post('/getOne', auth, UserCtrl.getAUser);
router.delete('/', auth, UserCtrl.deleteOneUser);
router.post('/getAdmins', UserCtrl.getUsersByFunction);


module.exports = router;