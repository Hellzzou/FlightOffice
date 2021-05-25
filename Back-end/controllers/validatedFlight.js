const ValidatedFlight = require('../models/validatedflight');

exports.createAValidatedFlight = (req, res) => {
	let flight = new ValidatedFlight(req.body.flight);
	flight.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};
exports.findOneValidatedFlight = (req, res) => {
	let query = {_id:req.body.id};
	ValidatedFlight.findOne(query)
		.then(NewFlight => res.status(200).json(NewFlight))
		.catch(error => res.status(400).json({error}));
};
exports.deleteOneValidatedFlight = (req,res,next) =>{
	ValidatedFlight.deleteOne({_id: req.body.id})
		.then(() => res.status(200).json('success'))
		.catch(error => res.status(400).json({error}));
};
exports.findValidateFlightsBetweenThisDates = (req, res) => {
	let query = {date:{$gt:req.body.startDate, $lt:req.body.endDate}};
	ValidatedFlight.find(query)
		.then(ValidatedFlight => res.status(200).json(ValidatedFlight))
		.catch(error => res.status(400).json({error}));
};