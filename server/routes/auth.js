var Auth = require('../models/auth.js');
var User = require('../models/users.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = router;

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/facebook/callback', passport.authenticate('facebook', 
  {failureRedirect: '/facebook', successRedirect: '/'}))

router.get('/google', passport.authenticate('google', {scope:['email','profile']}));

router.get('/google/callback', passport.authenticate('google', 
  {failureRedirect: '/google', successRedirect: '/'}))

router.get('/paypal', passport.authenticate('paypal'),function(req,res,next){
	console.log('in initial part of callback:', req);

	next();
});

router.get('/paypal/callback', passport.authenticate('paypal', 
  {failureRedirect: '/paypal'}), function(req,res){
	console.log('req in paypal/callback', req);
	res.redirect('/');
})




router.get(('/logout'),function(req,res){
  User.editProfile({id:req.user.id, showModal: 1})
    .then(() => {
	    req.session.destroy(function(){
	    req.sessionID = null;
	    req.logout();
	    res.redirect('/')
      })
    })
	 .catch(err => console.warn(err));
})

