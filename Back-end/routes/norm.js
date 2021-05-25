const express = require('express');
const router = express.Router();
const NormCtrl = require('../controllers/norm');
const auth = require('../authentification/auth');

router.delete('/', auth, NormCtrl.deleteAllNorms);
router.post('/find', auth, NormCtrl.findNormWithName);
router.get('/', auth, NormCtrl.getAllNorms);
router.post('/save', auth, NormCtrl.createNorm);

module.exports = router;