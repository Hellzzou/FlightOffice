const User = require('../models/user');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    Bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({rank: req.body.rank, name: req.body.name, login: req.body.login, password:hash, responsability:req.body.responsability, access: req.body.access});
            user.save()
                .then(() => res.status(201).json('Utilisateur crée'))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
exports.login = (req, res, next ) => {
    let query = {login: req.body.login};
    User.findOne(query)
        .then( user => {
            if (!user) return res.status(401).json({error: "Utilisateur innconnu"});
            Bcrypt.compare(req.body.password, user.password)
            .then(valid =>{
                if (!valid) return res.status(401).json({error: 'Mot de passe incorrect'});
                res.status(200).json({
                    userID : user._id,
                    userRank : user.rank,
                    userName : user.name,
                    userResponsability : user.responsability,
                    userAccess : user.access,
                    token: jwt.sign(
                        {userID : user._id },
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '1h'}
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
exports.getAllUsers = (req, res, next) => {
    User.find({})
        .then(User => res.status(200).json(User))
        .catch(error => res.status(400).json({error}));
};
exports.getAUser = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const query = {_id: decodedToken.userID};
        User.findOne(query)
            .then(User => res.status(200).json(User))
            .catch(error => res.status(500).json({error}))
    }catch (error){
        res.status(401).json({error: error | "Vous n'êtes pas autorisé à faire cette requête"});
    }
};
exports.deleteOneUser = (req, res, next) => {
    let query = {name: req.body.name};
    User.deleteOne(query)
        .then(() => res.status(200).json('success'))
        .catch(error => res.status(400).json({error}));
}
exports.getUsersByFunction = (req, res, next ) => {
    let query = { responsability: req.body.responsability};
    User.find(query)
        .then(User => res.status(200).json(User))
        .catch(error => res.status(400).json({error}));
}