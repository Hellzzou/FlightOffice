const NewFlight = require('../models/newflight');

exports.createNewFlight = (req, res) => {
	let flight = new NewFlight(req.body);
	flight.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};
exports.findNewFlightWithID = (req, res) => {
	let query = {_id:req.body.id};
	NewFlight.findOne(query)
		.then(NewFlight => res.status(200).json(NewFlight))
		.catch(error => res.status(400).json({error}));
};
exports.getAllNewFlights =(req, res, next) => {
	NewFlight.find({})
		.then(NewFlight => res.status(200).json(NewFlight))
		.catch(error => res.status(400).json({error}));
};
exports.deleteNewFlightWithID =(req,res,next) =>{
	NewFlight.deleteOne({_id: req.body.id})
		.then(() => res.status(200).json('success'))
		.catch(error => res.status(400).json({error}));
};