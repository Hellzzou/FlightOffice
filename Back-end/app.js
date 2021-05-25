const express = require('express'); // importe express
const app = express();				// notre application express
const bodyParser = require('body-parser'); // permet d'utiliser le format JSON
const mongoose = require('mongoose');	// importe mongoose
const areaRoutes = require('./routes/area');
const typeRoutes = require('./routes/type');
const simpilRoute = require('./routes/simpil');
const groupRoute = require('./routes/group');
const pilotRoute = require('./routes/pilot');
const normRoute = require('./routes/norm');
const newFlightRoute = require('./routes/newFlight');
const validatedFlightRoute = require('./routes/validatedFlight');
const userRoute = require('./routes/user');
mongoose.connect('mongodb://localhost:27017/bureaudesvols', {useNewUrlParser: true}); // connecte mongoose a la db

app.use(bodyParser.json());
app.use((req, res, next) => { // sans autre argument cette fonction sera executee a toutes les requetes ( il autorise tout et evite donc les erreurs CORS)
  res.setHeader('Access-Control-Allow-Origin', '*'); // permet à tous les ports d'acceder à notre serveur
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // autorise les headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // autorise les methodes d'acces a notre serveur
  next(); // passe a la fonction de l'API suivante
});
app.use('/api/area', areaRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/simpil', simpilRoute);
app.use('/api/group', groupRoute);
app.use('/api/pilot', pilotRoute);
app.use('/api/norm', normRoute);
app.use('/api/newFlight', newFlightRoute);
app.use('/api/validatedFlight', validatedFlightRoute);
app.use('/api/user', userRoute);

module.exports = app; // exporte notre appli express pour qu'on puisse l'utiliser sur le server.js