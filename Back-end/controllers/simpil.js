const Simpil = require('../models/simpil');

exports.createSimpil = (req, res) => {
	let simpil = new Simpil(req.body);
	simpil.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};
exports.getSimpilsBetweenTwodates = (req, res) => {
	let query = {date:{$gt:req.body.startDate, $lt:req.body.endDate}};
	Simpil.find(query)
		.then(Simpil => res.status(200).json(Simpil))
		.catch(error => res.status(400).json({error}));
};