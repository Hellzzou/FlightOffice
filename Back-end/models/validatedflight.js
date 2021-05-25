const mongoose = require('mongoose');

const validatedflightSchema = mongoose.Schema({
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
    group: { type: String, required: true },
    client: { type: String, required: true },
    manager: { type: String, required: true },
    exercice: {type: String, required: false},
    done: { type: String, required: true },
    cause: { type: String, required: true },
    area: { type: String, required: true },
});

module.exports = mongoose.model('validatedflights', validatedflightSchema);