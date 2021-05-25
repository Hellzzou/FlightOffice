const mongoose = require('mongoose');

const newflightSchema = mongoose.Schema({
  date: { type: Date, required: true },
  scheduledDeparture :{type: String, required: true},
  dayDuration: { type: Number, required: true },
  nightDuration: { type: Number, required: true },
  belonging : {type: String, required: true },
  mission: { type: String, required: true },
  type: { type: String, required: true},
  aircraftNumber: { type: Number, required: true },
  crew: { type: String, required: true },
  flightType: [{
      type: {type:String, required:true},
      day: {type:Number, required:true},
      night: {type:Number, required:true}
    }],
  pilots:  [{
      name: {type:String, required:true},
      day: {type:Number, required:true},
      night: {type:Number, required:true}
    }],
});

module.exports = mongoose.model('newflights', newflightSchema);