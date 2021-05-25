const Group = require('../models/group');

exports.findClientFromUnderGroupAndManager = (req, res) => {
	let query = {underGroup:req.body.underGroup, manager:req.body.manager};
	Group.find(query)
		.then(Group => res.status(200).json(Group))
		.catch(error => res.status(400).json({error}));
};
exports.findManagerFromUnderGroupAndClient = (req, res) => {
	let query = {underGroup:req.body.underGroup, client:req.body.client};
	Group.find(query)
		.then(Group => res.status(200).json(Group))
		.catch(error => res.status(400).json({error}));
};
exports.findGroupsWithUnderGroup = (req, res) => {
	let query = {underGroup:req.body.underGroup};
	Group.find(query)
		.then(Group => res.status(200).json(Group))
		.catch(error => res.status(400).json({error}));
};
exports.findGroupsWithGroup = (req, res) => {
	let query = {group:req.body.group};
	Group.find(query)
		.then(Group => res.status(200).json(Group))
		.catch(error => res.status(400).json({error}));
};
exports.createGroup = (req, res) => {
	let group = new Group(req.body.group);
	group.save(function(err){
		if (err) res.status(400).json("Erreur de connexion !");
		else res.status(200).json("success");
	})
};
exports.getAllGroups = (req, res, next) => {
	Group.find({})
		.then(Group => res.status(200).json(Group))
		.catch(error => res.status(400).json({error}));
};
exports.deleteAllGroups = (req, res) => {
	Group.remove({})
		.then(() => res.status(200).json('deleted'))
		.catch(error => res.status(400).json({error}));
};