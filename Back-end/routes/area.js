const express = require('express');
const router = express.Router();
const AreaCtrl = require('../controllers/area');
const auth = require('../authentification/auth');

router.get('/', AreaCtrl.findAllAreas);
router.delete('/', auth, AreaCtrl.deleteAllAreas);
router.post('/', auth, AreaCtrl.createAnArea);

module.exports = router;