const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next ) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userID = decodedToken.userID;
        User.findOne({_id:userID})
            .then( user => {
                if ( req.body.access && req.body.access > user.access) throw("Vous n'êtes pas autorisé à faire cette requête");
                else next();
            })
            .catch(error => res.status(500).json({error}));
    }catch (error){
        res.status(401).json({error: error | "Vous n'êtes pas autorisé à faire cette requête"});
    }
};