const express = require('express');
const router = express.Router();
const NewFlightCtrl = require('../controllers/newFlight');
const auth = require('../authentification/auth');

router.post('/save', auth, NewFlightCtrl.createNewFlight);
router.post('/find', auth, NewFlightCtrl.findNewFlightWithID);
router.get('/', auth, NewFlightCtrl.getAllNewFlights);
router.delete('/', auth, NewFlightCtrl.deleteNewFlightWithID);

module.exports = router;