const Type = require('../models/type');

exports.getAllTypes = (req, res, next) => {
	Type.find({})
		.then(Type => res.status(200).json(Type))
		.catch(error => res.status(400).json({error}));
};
exports.deleteAllTypes = (req, res) => {
	Type.remove({})
		.then(() => res.status(200).json('deleted'))
		.catch(error => res.status(400).json({error}));
};
exports.crateAtype = (req, res) => {
	let type = new Type(req.body.type);
	type.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};