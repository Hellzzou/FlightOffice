const Area = require('../models/area');

exports.findAllAreas = (req, res, next) => {
	Area.find({})
		.then(Area => res.status(200).json(Area))
		.catch(error => res.status(400).json({error}));
};
exports.deleteAllAreas = (req, res, next) => {
	Area.remove({})
		.then(() => res.status(200).json('deleted'))
		.catch(error => res.status(400).json({error}));
};
exports.createAnArea = (req, res, next) => {
	let area = new Area(req.body.area);
	area.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};