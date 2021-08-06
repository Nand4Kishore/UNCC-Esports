const model = require('../models/connection');
const Rsvp = require('../models/rsvp');
const validationResult= require('express-validator').validationResult;


exports.index = (req,res)=>{
    let events = model.find();
    res.render('./index');
};




exports.new = (req,res)=>{
    res.render('./connection/newconnection');
};



exports.connections = (req, res,next) => {
    let map= new Map();
    model.find().then(connections => {
        for(let i=0;i<connections.length;i++){
            let events=[];
            let evettype=connections[i].Type;
            //console.log(evettype);
            if(!map.has(evettype)){       
                events.push(connections[i]);
                map.set(evettype,events);    
            }        
            else{
                let array=map.get(evettype);
                array.push(connections[i])
                map.set(evettype,array);
            }         
        }
        //console.log(map, 'map is ');
        res.render('./connection/connections',{map:map});
    })
    .catch(err => {
        console.log(err);
        next();
    });   
}



exports.create = (req, res, next)=>{
    let event = new model(req.body);
    event.author = req.session.user;
    event.save()
    .then(event=>{
        req.flash('success', 'Event has been created successfully');
        res.redirect('/connections')
    })
    .catch(err=>{
        if(err.name === "ValidationError"){
           // err.status=400;
           req.flash('error', err.message);
           return res.redirect('/back');
        }
        next(err);
    });
    
};


exports.show = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id).populate('author', 'firstName lastName')
    .then(result => {           
        if (result){ 
            Rsvp.find({ connection:req.params.id,action:'Yes'}).countDocuments().then(count=>{
                res.render('./connection/connection', { event: result,count:count});
            })            
           .catch(err=>{
                res.render('./connection/connection', { event: result,count:0});
           });
        }
        else
            res.redirect('/connections');
    })
    .catch(err => {
        console.log(err);
        next();
    });
}


exports.update = (req, res, next)=>{
    let story = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id,story, {useFindAndModify: false, runValidators: true})
    .then(story=>{
        req.flash('success', 'Event has been updated successfully');
        return res.redirect('/connections/'+id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    } );
        
};


exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(event=>{
             return res.render('./connection/updateconnection', {event});
    })
    .catch(err=>next(err));
};


exports.delete = (req, res, next)=>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false} )
    .then(story => {
            req.flash('success', 'Event has been deleted     successfully');
            res.redirect('/connections');
    })
    .catch(err=>next(err));      
    
};

exports.getSavedConnections = (req, res,next) => { 
    Promise.all([Rsvp.find({user:req.session.user.id}).populate('connection'), 
        model.find({author:req.session.user})])        
        .then(result => {
                if (result){
                    const [rsvps,connections] = result;  
                    req.flash('success','Successfully Created or updated the RSVP for the event!');  
                    res.render('./connection/savedConnections', { rsvps,connections});
                    console.log(res.locals.successMessages);
                }
            else
                res.redirect('/connections');
        })
        .catch(err => {
            console.log(err);
            next();
    });   
}