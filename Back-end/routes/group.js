const express = require('express');
const router = express.Router();
const GroupCtrl = require('../controllers/group');
const auth = require('../authentification/auth');

router.post('/findManager', auth, GroupCtrl.findClientFromUnderGroupAndManager);
router.post('/findClient', auth, GroupCtrl.findManagerFromUnderGroupAndClient);
router.post('/findUnderGroup', auth, GroupCtrl.findGroupsWithUnderGroup);
router.post('/findGroup', auth, GroupCtrl.findGroupsWithGroup);
router.post('/save', auth, GroupCtrl.createGroup);
router.get('/', GroupCtrl.getAllGroups);
router.delete('/', auth, GroupCtrl.deleteAllGroups);

module.exports = router;