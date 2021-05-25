const express = require('express');
const router = express.Router();
const TypeCtrl = require('../controllers/type');
const auth = require('../authentification/auth');

router.get('/', TypeCtrl.getAllTypes);
router.delete('/', auth, TypeCtrl.deleteAllTypes);
router.post('/', auth, TypeCtrl.crateAtype);

module.exports = router;