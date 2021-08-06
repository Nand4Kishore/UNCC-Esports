const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    connection:{
        type:Schema.Types.ObjectId,
        ref:'Event'
    },
    action: { 
        type: String
    }
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

module.exports = Rsvp;