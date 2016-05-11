"use strict"
var Users        = require('../models/users.js');
var Identity     = require('../models/Identity');
var express      = require('express');
var http         = require('http-request');
var Middleware   = require('../middleware');
var Paypal       = require('paypal-adaptive');
var uuid         = require('node-uuid');//remove from package json
var ipn          = require('paypal-ipn');
var Credentials  = require('../config/auth_secrets.js')
var router       = express.Router();

module.exports = router;


var paypalSDK = new Paypal({
    userId:  Credentials.paypalAPI.userID,
    password:  Credentials.paypalAPI.password,
    signature: Credentials.paypalAPI.signature,
    appID: 'APP-80W284485P519543T',
    sandbox:   true //defaults to false 
});


if (process.env.NODE_ENV !== 'test'){
  router.use(function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.status(401).send('user not authenticated');
    }
  });
}

router.post('/paypal', function(req,res){
  console.log('req.body:', req.body);
  var payment = createPaymentObj(req.body);
  var sync_mode = false;

  console.log('payment:', payment);


  return paypalSDK.pay(payment, function (error, paymentResp) {
	  if (error) {
      var err = paymentResp.error[0].message;
	    res.status(400).send({err:err});
	  } else {
      res.status(200).send({redirect: paymentResp.paymentApprovalUrl});
	  }
	})
});

let createPaymentObj = (obj) => {

let payLoad = {
    requestEnvelope: {
        errorLanguage:  'en_US'
    },
    actionType:     'PAY',
    currencyCode:   'USD',
    feesPayer:      'EACHRECEIVER',
    memo:            obj.note,
    cancelUrl:      'http://127.0.0.1:3000/cancel',
    returnUrl:      'http://127.0.0.1:3000/'+ obj.returnURL,
    receiverList: {
        receiver: 
            {
                email: obj.email,
                amount: obj.amount,
                primary: false
            }
        }
  };
  return payLoad;
};








