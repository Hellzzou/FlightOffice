const Norme = require('../models/norme');

exports.deleteAllNorms = (req, res) => {
	Norme.remove({})
		.then(() => res.status(200).json('deleted'))
		.catch(error => res.status(400).json({error}));
};
exports.findNormWithName = (req, res) => {
	let query = {name:req.body.name};
	Norme.find(query)
		.then(Norme => res.status(200).json(Norme))
		.catch(error => res.status(400).json({error}));
};
exports.getAllNorms = (req, res, next) => {
	Norme.find({})
		.then(Norme => res.status(200).json(Norme))
		.catch(error => res.status(400).json({error}));
};
exports.createNorm =(req, res) => {
	let norm = new Norme(req.body.norm);
	norm.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};