const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    
    Title: {type: String, required: [true, 'title is required']},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    Type: {type: String, required: [true, 'title is required']},
    Location :  {type: String, required: [true, 'title is required']},
    starttime :{type: String, required: [true, 'title is required']},
    endtime : {type: String, required: [true, 'title is required']},
    createdBy: {type: String, required: [true, 'author is required']},
    date : {type: String, required: [true, 'author is required']},
    image: {type: String, required: [true, 'author is required']},
    details: {type: String, required: [true, 'content is required'], 
                minLength: [10, 'the content should have atleast 10 characters']}
},
{timestamps: true}
    
);


module.exports = mongoose.model('Event', connectionSchema);






