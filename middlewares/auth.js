const Event = require('../models/connection');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else {
         req.flash('error', 'You are logged in already');
         return res.redirect('/users/profile');
     }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next();
    }else {
         req.flash('error', 'You need to log in first');
         return res.redirect('/users/login');
     }
};

//check if user is author of the story
exports.isAuthor = (req, res, next) =>{
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        if(event) {
            if(event.author == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + req.params.id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isIn = (req, res, next) => {
    console.log(req.params.action);
     if ((req.params.action==="Yes"|| req.params.action==="No"||req.params.action==="Maybe")) {
       next();
    } else {
        console.log('else block');        
        req.flash('error','RSVP Decision can be only Yes, No or Maybe');
        res.redirect("/connections/savedConnections");
    }
}
