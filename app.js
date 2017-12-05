var express = require('express');

var fs = require('fs');
var app = express();
var jade = require('pug');
var LE = require('greenlock');
var insPORT = 8081;
var PORT = 8080;
var allDomains;
var bitsokoEmail = 'swahilisafarifame@gmail.com';

var compress = require('compression');

var nCmd = require('node-cmd');

https = require('https');


var request = require("request");


function updateApps() {
 
  try{
     OpenSecure();


   }catch(err){
       console.log(err);
 
 console.log('security certificates not found! initiating letsencrypt..',err);

	   
	installCerts();   
   } 

}


le = LE.create({
    agreeToTerms: leAgree // hook to allow user to view and accept LE TOS
        ,
    server: LE.productionServerUrl // or LE.productionServerUrl
        //, server: LE.stagingServerUrl 
        //, store: leStore 

        ,
    challenges: {
        'http-01': require('le-challenge-fs').create({
            webrootPath: '/root/business'
        })
    },
    store: require('le-store-certbot').create({
            webrootPath: '/root/business'
        })
        // handles saving of config, accounts, and certificates
        //, challenges: { 'http-01': leChallenge }                  // handles /.well-known/acme-challege keys and tokens
        ,
    challengeType: 'http-01' // default to this challenge type
        //, sni: require('le-sni-auto').create({})                // handles sni callback
        ,
    debug: true
});







function OpenInsecure() {

    insapp = express();
    insapp.use(compress());


    // If using express you should use the middleware
    insapp.use('/', le.middleware());
    http = require('http');
    inserver = http.createServer(insapp);

    io = require('socket.io')(inserver);
    insapp.get(/^(.+)$/, function (req, res) {
        ReqRes(req, res);

    });
    inserver.listen(insPORT, '0.0.0.0', function (err) {
        if (err) throw err;
        console.log('insec port online at http://localhost:' + insPORT);
      
 
      
    });

}


ReqRes = function ReqRes(req, res) {
try{

    console.log(req.params[0]);
    if (req.params[0] == '/index.html' || req.params[0] == '/') {

console.log('serving homepage')

        fs.readFile(__dirname + '/bits/amp.pug', function (error, source) {

            //console.log(rr.stores);  
		var allProms=false;
            var data = {
                name: allInfo.name,
  		cover: allInfo.cover,
  		tagline: allInfo.tagline,
                desc: 'desc',
                img: allInfo.icon,
                stores: allServices,
                promos: allProms,
                cid: '000'
            }
            data.body = process.argv[2];
            //jade.render
            var template = jade.compile(source);
            var html = template(data);
            //res.writeHead(200);
            return res.end(html);
        });

    } else {









        try {

            fs.accessSync(__dirname + req.params[0], fs.F_OK);

            res.sendFile(__dirname + req.params[0]);

        } catch (err) {
            // console.log(err);
            /*
            res.writeHead(301, {
                location: "/bits/index.html"
            });
            return res.end();
            */
		console.log('redirecting to homepage')

            
        fs.readFile(__dirname + '/bits/amp.pug', function (error, source) {

            //console.log(rr.stores);  
            var data = {
                name: 'test',
                desc: 'desc',
                img: '/img.png',
                stores: [],
                promos: [],
                cid: '000'
            }
            data.body = process.argv[2];
            //jade.render
            var template = jade.compile(source);
            var html = template(data);
            //res.writeHead(200);
            return res.end(html);
        });
        }

    }
    }catch(err){
console.log('ERR loading response ',err)
}
}


installCerts = function(){
   
    console.log('initiating cert installer');

'use strict';

var LE = require('greenlock');
/*
// Storage Backend
var leStore = require('le-store-certbot').create({
  configDir: '/root/certs'                          // or /etc/letsencrypt or wherever
, debug: true
});
// ACME Challenge Handlers
var leChallenge = require('le-challenge-fs').create({
  webrootPath: '/root/letsencrypt/var'                       // or template string such as
, debug: true                                            // '/srv/www/:hostname/.well-known/acme-challenge'
});
*/

function leAgree(opts, agreeCb) {
  // opts = { email, domains, tosUrl }
    opts = {
      domains: allDomains
    , email: bitsokoEmail // user@example.com
    , agreeTos: true
    }
  agreeCb(null, opts.tosUrl);
}

le = LE.create({
 agreeToTerms: leAgree                                   // hook to allow user to view and accept LE TOS
,  server: LE.productionServerUrl                             // or LE.productionServerUrl
//, server: LE.stagingServerUrl 
//, store: leStore 
	
, challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/root/business' }) }
, store: require('le-store-certbot').create({ webrootPath: '/root/business' })
// handles saving of config, accounts, and certificates
//, challenges: { 'http-01': leChallenge }                  // handles /.well-known/acme-challege keys and tokens
, challengeType: 'http-01'                                // default to this challenge type
//, sni: require('le-sni-auto').create({})                // handles sni callback
, debug: true
});

critiMSG="RUNNING ON INSECURE ENVIROMENT!!";
/*
  
insapp = express();
insapp.use(compress());
// If using express you should use the middleware
	 
insapp.use('/', le.middleware(require('redirect-https')()));
http = require('http');    
inserver = http.createServer(insapp);
io = require('socket.io')(inserver);
insapp.get(/^(.+)$/, function (req, res) {
  ReqRes(req, res);   
 
});
 inserver.listen(insPORT, '127.0.0.1', function(err) {
  if (err) throw err;
 console.log("Listening for ACME http-01 challenges on", this.address());
});
*/
	// handles acme-challenge and redirects to https 
require('http').createServer(le.middleware(require('redirect-https')())).listen(insPORT, function () {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

 
 
var app = require('express')();
app.use('/', function (req, res) {
  res.end('waiting to become secure');
});


//
// Otherwise you should see the test file for usage of this:
// le.challenges['http-01'].get(opts.domain, key, val, done)



// Check in-memory cache of certificates for the named domain
le.check({ domains: allDomains }).then(function (results) {
  if (results) {
    // we already have certificates
    console.log(results);
    return;
  }


  // Register Certificate manually
	  console.log('failed to register LE Certificate automatically, now trying manual registration');

  le.register({

    domains: allDomains                                // CHANGE TO YOUR DOMAIN (list for SANS)
  , email: bitsokoEmail                                 // CHANGE TO YOUR EMAIL
  , agreeTos: true                                            // set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
  , rsaKeySize: 2048                                        // 2048 or higher
  , challengeType: 'http-01'                                // http-01, tls-sni-01, or dns-01

  }).then(function (results) {

    console.log('success: certificates installed. Restarting service');

    throw 'success: certificates installed. Restarting service';

  }, function (err) {

    // Note: you must either use le.middleware() with express,
    // manually use le.challenges['http-01'].get(opts, domain, key, val, done)
    // or have a webserver running and responding
    // to /.well-known/acme-challenge at `webrootPath`

    console.error(err);
    console.error('[Error]: node-letsencrypt/examples/standalone');
    console.error(err.stack);
console.log('certification failed. will try again in one hour');
 setTimeout(installCerts(), (60*60*1000)); 
  });

});
	
}


function leAgree(opts, agreeCb) {
    // opts = { email, domains, tosUrl }
    opts = {
        domains: allDomains,
        email: bitsokoEmail // user@example.com
            ,
        agreeTos: true
    }
    agreeCb(null, opts.tosUrl);
}


function createCert() {


    critiMSG = "RUNNING ON INSECURE ENVIROMENT!!";

    // handles acme-challenge and redirects to https 
    require('http').createServer(le.middleware(require('redirect-https')())).listen(insPORT, function () {
        console.log("Listening for ACME http-01 challenges on", this.address());
    });



    var app = require('express')();
    app.use('/', function (req, res) {
        res.end('waiting to become secure');
    });




    //
    // Otherwise you should see the test file for usage of this:
    // le.challenges['http-01'].get(opts.domain, key, val, done)



    // Check in-memory cache of certificates for the named domain
    le.check({
        domains: allDomains
    }).then(function (results) {
        if (results) {
            // we already have certificates
            console.log(results);
            return;
        }


        // Register Certificate manually
        console.log('failed to register LE Certificate automatically, now trying manual registration');

        le.register({

            domains: allDomains // CHANGE TO YOUR DOMAIN (list for SANS)
                ,
            email: bitsokoEmail // CHANGE TO YOUR EMAIL
                ,
            agreeTos: true // set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
                ,
            rsaKeySize: 2048 // 2048 or higher
                ,
            challengeType: 'http-01' // http-01, tls-sni-01, or dns-01

        }).then(function (results) {

            console.log('success: certificates installed. Restarting service');

            throw 'success: certificates installed. Restarting service';


        }, function (err) {

            // Note: you must either use le.middleware() with express,
            // manually use le.challenges['http-01'].get(opts, domain, key, val, done)
            // or have a webserver running and responding
            // to /.well-known/acme-challenge at `webrootPath`

            console.error(err);
            console.error('[Error]: node-letsencrypt/examples/standalone');
            console.error(err.stack);

        });

    });


}


function OpenSecure(){
  
   servCerts = {
    key: fs.readFileSync('/root/letsencrypt/etc/live/'+allDomains[0]+'/privkey.pem'),
    cert: fs.readFileSync('/root/letsencrypt/etc/live/'+allDomains[0]+'/fullchain.pem'),
    ca: [fs.readFileSync('/root/letsencrypt/etc/live/'+allDomains[0]+'/chain.pem')] // <----- note this part
};   
  
app.use(compress());  
server = https.createServer(servCerts, app);
    
io = require('socket.io')(server);

server.setTimeout(0, socketTimeout);

	
app.get(/^(.+)$/, function (req, res) {
    
    ReqRes(req, res);
 
    
});


server.listen(PORT, function(err) {
  
  if (err) throw err;
console.log('Secure now online at https://localhost:' + PORT);
	

//OpenSecureRedirect();
	
});


}


 function socketTimeout(){console.log('sockets timed out: not receiving connecions!!')};
