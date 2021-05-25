const express = require('express');
const router = express.Router();
const validatedFlightsCtrl = require('../controllers/validatedFlight');
const auth = require('../authentification/auth');

router.post('/save', auth, validatedFlightsCtrl.createAValidatedFlight);
router.post('/find', auth, validatedFlightsCtrl.findOneValidatedFlight);
router.delete('/', auth, validatedFlightsCtrl.deleteOneValidatedFlight);
router.post('/byDate', auth, validatedFlightsCtrl.findValidateFlightsBetweenThisDates);

module.exports = router;