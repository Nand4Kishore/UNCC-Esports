const model = require('../models/user');
const Event = require('../models/connection');
const flash = require('connect-flash');
const Rsvp = require('../models/rsvp');
const{validationResult}  = require('express-validator');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    
    let user = new model(req.body);
    if (user.email)
        user.email = user.email.toLowerCase(); 
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    
    let email = req.body.email ;
    if (email)
        email = email.toLowerCase()
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.name = user.firstName;
                    req.flash('success', 'You have successfully logged in');
                    //console.log(req.flash())
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Event.find({author: id}),Rsvp.find({user:req.session.user.id}).populate('connection')])
    .then(results=>{
        const [user, events,rsvps] = results;
        res.render('./user/profile', {user, events,rsvps});
    })
    .catch(err=>next(err));


};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



