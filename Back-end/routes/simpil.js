const express = require('express');
const router = express.Router();
const SimpilCtrl = require('../controllers/simpil');
const auth = require('../authentification/auth');

router.post('/save', auth, SimpilCtrl.createSimpil);
router.post('/byDate', auth, SimpilCtrl.getSimpilsBetweenTwodates);

module.exports = router;