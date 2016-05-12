"use strict";

var GoogleStrategy    = require('passport-google-oauth2').Strategy;
var PayPalStrategy    = require('passport-paypal-oauth').Strategy;
var FacebookStrategy  = require('passport-facebook').Strategy;
var User              = require('../models/users');
var Identity          = require('../models/Identity');
var nodemailer        = require('nodemailer');
var wellknown         = require('nodemailer-wellknown');

if (process.env.NODE_ENV !== 'production'){
  var Credentials       = require('./auth_secrets.js');
}

var Strategies = module.exports;

const identityEntry = (uid,pid,params,provider) => {
  var identityObj = {};
  identityObj.user_id = uid;
  identityObj.provider_id = pid;
  identityObj.provider = provider;
  identityObj.token = params.access_token;
  identityObj.refresh = params.refresh_token;
  identityObj.expires = params.expires;
  return identityObj;
}


let FacebookID     = process.env.FACEBOOK_APP_ID     || Credentials.facebook.ID;
let FacebookSecret = process.env.FACEBOOK_APP_SECRET || Credentials.facebook.SECRET;
let GoogleID       = process.env.GOOGLE_APP_ID       || Credentials.google.ID;
let GoogleSecret   = process.env.GOOGLE_APP_SECRET   || Credentials.google.SECRET;
let PaypalID       = process.env.PAYPAL_APP_ID       || Credentials.paypal.ID;
let PaypalSecret   = process.env.PAYPAL_APP_SECRET   || Credentials.paypal.SECRET;


/*To allow mutiple Oauth strategies without creating duplicate records 
in database, strategies check current request for user property (Ex. ln.60). This is allowed
by using 'passReqToCallback' in respective strategy's option object(Ex. ln.55). 
If this prop is present, the user has already authenticated through one of 
the various strategies and is attempting to link another social account to 
the current record. At this point in the flow, the user passes into the else block 
of the appropriate strategy(Ex. ln.108). An identity record is created and 
stored in the identity table linking the current user to this social account. The user profile
is also updated with this information(Ex.ln. 115,116);thus, a
single user can have multiple identities--all of which can be used to sign in. */



Strategies.facebook_strat = new FacebookStrategy({
    clientID: FacebookID,
    clientSecret: FacebookSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'picture.type(large)','email'],
    passReqToCallback: true
  },
  (req, accessToken, refreshToken,params, profile, done) => {
    // console.log('params at start of strategy:', params)

    //check DB for user--IF exists, execute cb->line 68
    //ELSE create profile, store in DB, execute cb->lines 70-85
  if(!req.user){
    Identity.getByProviderID(profile.id)
      .then( userObj => {
        if(userObj[0]){
          User.getById({id:userObj[0].user_id})
            .then( profile => done(null, profile[0]))
            .catch( err => console.warn(err));
        }else{
          let userProfile = {
            name: profile.displayName,
            username:profile.displayName.split(' ').join(''),
            email: profile.emails[0].value,
            img_url: profile.photos[0].value,
            primary: 'facebook',
            facebook: 1,
            google: 0,
            paypal: 0,
            showModal: 1
          };

          let config = wellknown('GandiMail');
          config.auth = {
            user: 'info@fairshare.cloud',
            pass: 'AeK6yxhT'
          };
          let transporter = nodemailer.createTransport(config);

          let mailOptions = {
            from: '"Info" <info@fairshare.cloud>',
            to: '<'+ profile.emails[0].value +'>',
            subject: "Welcome to Fairshare",
            text: 'Thank you for joining!',
          };

          transporter.sendMail(mailOptions, function(err, info){
            if(err){
                return console.log(err);
            }
            console.log('Message sent: ' + info.response);
          });

          User.create(userProfile)
            .then( id => {
          //attach app ID to userProfile for use in fn serializeUser->line 34
              userProfile.id = id[0];
              let ID = identityEntry(id[0], profile.id,params,'facebook');
                Identity.create(ID)
                  .then( () => done(null, userProfile))
                  .catch( err => console.warn(err));
            });
        }
      })
      .catch( err => console.warn('Error @facebook strategy:', err));
  }else{
    let ID = identityEntry(req.user.id, profile.id, params,'google');
    req.user.facebook = 1;
    User.editProfile(req.user)
      .then( () => {
        Identity.create(ID)
          .then( () => done(null, req.user))
          .catch( err => console.warn(err))
      })
      .catch( err => console.warn(err))
  }
});

Strategies.google_strat = new GoogleStrategy({
    clientID: GoogleID,
    clientSecret: GoogleSecret,
    callbackURL: 'http://fairshare.com/auth/google/callback',
    passReqToCallback: true
  },
   (req, accessToken, refreshToken,params, profile, done) => {

    //check DB for user--IF exists, execute cb->line 68
    //ELSE create profile, store in DB, execute cb->lines 70-85
    // console.log('profile from google:', profile);
  if(!req.user){
    Identity.getByProviderID(profile.id)
      .then( userObj => {
        if(userObj[0]){
          User.getById({id:userObj[0].user_id})
            .then( profile => done(null, profile[0]))
            .catch( err => console.warn(err))
        }else{
          let userProfile = {
            name: profile.displayName,
            username:'',
            email: profile.emails[0].value,
            img_url: profile.photos[0].value,
            primary: 'google',
            facebook: 0,
            google: 1,
            paypal: 0,
            showModal: 1
          };

          let config = wellknown('GandiMail');
          config.auth = {
            user: 'info@fairshare.cloud',
            pass: 'AeK6yxhT'
          };
          let transporter = nodemailer.createTransport(config);

          let mailOptions = {
            from: '"Info" <info@fairshare.cloud>',
            to: '<'+ profile.emails[0].value +'>',
            subject: "Welcome to Fairshare",
            text: 'Thank you for joining!',
          };

          transporter.sendMail(mailOptions, function(err, info){
            if(err){
                return console.log(err);
            }
            console.log('Message sent: ' + info.response);
          });

          User.create(userProfile)
            .then( id => {
          //attach app ID to userProfile for use in fn serializeUser->line 34
              userProfile.id = id[0];
              let ID = identityEntry(id[0], profile.id,params,'google');
                Identity.create(ID)
                  .then( () => done(null, userProfile))
                  .catch( err => console.warn(err));
            });
        }
      })
      .catch( err => console.warn('Error @google strategy:', err));
  }else{
    let ID = identityEntry(req.user.id, profile.id, params,'google');
    req.user.google = 1;
    User.editProfile(req.user)
      .then( () => {
        Identity.create(ID)
          .then( () => done(null, req.user))
          .catch( err => console.warn(err))
      })
      .catch( err => console.warn(err))
  }
});

Strategies.paypal_strat = new PayPalStrategy({
    clientID: PaypalID,
    clientSecret: PaypalSecret,
    callbackURL: 'http://www.fairshare.cloud/auth/paypal/callback',
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, params, profile, done) => {
    //check DB for user--IF exists, execute cb->line 68
    //ELSE create profile, store in DB, execute cb->lines 70-85
  if(!req.user){
    Identity.getByProviderID(profile.id)
      .then( userObj => {
        if(userObj[0]){
          User.getById({id:userObj[0].user_id})
            .then( profile => done(null, profile[0]))
            .catch( err => console.warn(err));
        }else{
          let userProfile = {
              name: profile.name,
              username:'',
              email: profile._json.email,
              img_url:"",
              primary: 'paypal',
              facebook: 0,
              google: 0,
              paypal: 1,
              showModal: 1
            };
          let config = wellknown('GandiMail');
          config.auth = {
            user: 'info@fairshare.cloud',
            pass: 'AeK6yxhT'
          };
          let transporter = nodemailer.createTransport(config);

          let mailOptions = {
            from: '"Info" <info@fairshare.cloud>',
            to: '<'+ profile._json.email +'>',
            subject: "Welcome to Fairshare",
            text: 'Thank you for joining!',
          };

          transporter.sendMail(mailOptions, function(err, info){
            if(err){
                return console.log(err);
            }
            console.log('Message sent: ' + info.response);
          });
          User.create(userProfile)
            .then( id => {
          //attach app ID to userProfile for use in fn serializeUser->line 34
              userProfile.id = id[0];
              let ID = identityEntry(id[0], profile.id,params,'paypal');
                Identity.create(ID)
                  .then( () => done(null, userProfile))
                  .catch( err => console.warn(err));
            });
        }
      })
      .catch( err => console.warn('Error @paypal strategy:', err));
  }else{
    let ID = identityEntry(req.user.id, profile.id, params,'google');
    req.user.paypal = 1;
    User.editProfile(req.user)
      .then( () => {
        Identity.create(ID)
          .then( () => done(null, req.user))
          .catch( err => console.warn(err));
      })
      .catch( err => console.warn(err));
    }
});
