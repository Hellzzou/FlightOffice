const express = require('express');
const router = express.Router();
const PilotCtrl = require('../controllers/pilot');
const auth = require('../authentification/auth');

router.get('/', PilotCtrl.getAllPilots);
router.delete('/', auth, PilotCtrl.deleteAllPilots);
router.post('/23F', auth, PilotCtrl.getAllPilotsFrom23F);
router.post('/save', auth, PilotCtrl.createPilot);
router.post('/getOne', auth, PilotCtrl.getPilotByName);

module.exports = router;