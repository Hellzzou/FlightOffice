const Pilot = require('../models/pilot');

exports.getAllPilots = (req, res, next) => {
	Pilot.find({})
		.then(Pilot => res.status(200).json(Pilot))
		.catch(error => res.status(400).json({error}));
};
exports.deleteAllPilots = (req, res) => {
	Pilot.remove({})
		.then(() => res.status(200).json('deleted'))
		.catch(error => res.status(400).json({error}));
};
exports.getAllPilotsFrom23F = (req, res) => {
	let query = {belonging:req.body.belonging};
	Pilot.find(query)
		.then(Pilot => res.status(200).json(Pilot))
		.catch(error => res.status(400).json({error}));
};
exports.createPilot = (req, res) => {
	let pilot = new Pilot(req.body.pilot);
	pilot.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};
exports.getPilotByName = (req, res, next) => {
	let query = {name: req.body.name};
	Pilot.find(query)
		.then(Pilot => res.status(200).json(Pilot))
		.catch(error => res.status(400).json({error}));
};