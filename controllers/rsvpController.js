const Rsvp = require('../models/rsvp');
const Connection = require('../models/connection');

exports.updateRsvp = (req, res, next) => {  
    let rsvpParams = {
        user:req.session.user.id,
        connection:req.params.id,
        action:req.params.action
    };
    Rsvp.updateOne(
        {connection: req.params.id, user: req.session.user.id},
        { $set: rsvpParams },
        {upsert:true})
        .then(result => {                    
            Promise.all([Rsvp.find({user:req.session.user.id}).populate('connection').populate('user'), 
            Connection.find({author:req.session.user})])     
            //Connection.find({author: id})] )      
            .then(reslt => {
                const [rsvps,connections] = reslt;            
                if (reslt){ 
                    
                    //res.render('./connection/savedConnections', {rsvps,connections});
                    req.flash('success', 'rsvp has been updated successfully');
                    res.redirect('/users/profile')
                    
                }
                else
                    res.redirect('/connections');
                })           
        })
        .catch(err => {
            console.log(err);
            next();
        });
}

exports.deleteRsvp = (req, res, next) => {  
    Rsvp.findOneAndDelete({connection:req.params.id})
   .then(result=>{
        req.flash('success', 'RSVP has been deleted     successfully');
        res.redirect('/connections/savedConnections');
    })
    .catch(err => {
        console.log(err);
        next();
    });
}

exports.getUpdateRsvp = (req, res, next) => {
    console.log(req.params.id);
    Rsvp.find({connection:req.params.id},{action:'Yes'}).countDocuments()
        .then(count => {           
            res.render('./connection/req.params.id',{count:count});           
        })
        .catch(err => {
            console.log(err);
            next();
        });
}
