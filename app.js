"use strict"
// process.on('uncaughtException', function(err){
// 	console.log('>>> Uncaught exception: '+err);
// });
var argv = require('minimist')(process.argv.slice(2));
var c = console;
// c.dir(argv);

c.log("Здравствуйте, уважаемый "
	+(process.env['USERNAME'])
	+' '+process.platform
	+(argv['debug'] ? '. Режим отладки включен.' : "")
)

// console.log(process.env)

// var util = require('util');
// console.log(	util.inspect({
// 		akjfh:1,
// 		sdfwf:2,
// 		arr:[1,2,3,4,5]
// 	}, {depth:null})
// )

// var beeper = require('beeper');
//beeper();

/*const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/


var mysql = require('mysql');
var config = require('./config');
if (process.env.isprod == 'true'){
  var configDb = config.herokuMysql;
}else{
  var configDb = config.mysql;
}
c.log('################################')
c.log(configDb)
var pool  = mysql.createPool(configDb);

var database = require('./database')(pool);

/*var moment = require('moment');
var cheerio = require('cheerio');*/
// var request = require('request');
// var req = request.defaults({'proxy':'http://wsproxy.alfa.bank.int:3128'});

// var grabber = require('./grabber')(database, request, moment, cheerio);
// grabber.grabe();
// database.createTable();
var async = require('async');
// var browser = require('zombie');

// browser.proxy = 'http://wsproxy.alfa.bank.int:3128';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var events = require('events');
var eventEmitter = new events.EventEmitter();


console.log("++++++++++++++");
console.log(process.memoryUsage());

var timeout = 0;
eventEmitter.on('scrapped', function(){
  console.log('scrapped executed. ' + (timeout/60000) + ' minutes' );
  console.log(process.memoryUsage());
    
  if(typeof global.gc == 'function'){
    global.gc();
    c.log('################################ erised GC')
    console.log(process.memoryUsage());
  }
 

  var timeoutId = setTimeout(function() {
    var scrapper = require('./scrapper_zombie')();
    // timeout = scrapper.getRandomIntMinutes(30, 50);
    timeout = 10000;
    c.log("************-----------------------------------******  "+timeout + '  (' + timeout/60000 + ' minutes )')
    c.log(scrapper.scrape)
    scrapper.scrape(database, eventEmitter);
  }, timeout);

});
eventEmitter.emit('scrapped');

var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


/*var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);*/

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;
var db = new Db('tutor',
  new Server("localhost", 27017, {safe: true}, {auto_reconnect: true}, {})
);

db.open(function(){
  if(db.serverConfig.isConnected()){
    console.log("mongo db is opened!");
    db.portfolio.createIndex( { "title": 1 }, { unique: true } );
  }else{
    console.log("mongo db is NOT AVAILABLE!");
  }
});

db.collection('portfolio', function(error, portfolio) {
  db.portfolio = portfolio;
});

app.post("/dbPortfolioAdd", function(req, res) {
  db.portfolio.insert(req.body);
  
  /*for(var item in req.body){
    c.log('------------------------')
    db.portfolio.update({}, req.body[item], {upsert:true});
  }
 */

  c.log('--- inserted :');
  // c.log(req.body);
  res.end();
});

app.get("/dbPortfolio", function(req,res) {
  db.portfolio.find(req.query).toArray(function(err, items) {
    res.send(items);
    c.log('--- found :')
    c.log(items);
  });
});

app.delete("/dbPortfolio", function(req,res) {
  var id = new ObjectID(req.query.id);
  db.portfolio.remove({_id: id}, function(err){
    if (err) {
      console.log(err);
      res.send("Failed");
    } else {
      res.send("Success");
    }
    res.end();
  });
});








 
app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/getAll', function (req, res) {
  database.getAll(function(result){
      res.send(result )
  });
  // console.log(process.memoryUsage());
  // console.log("                                      ^^^^^^^^^^^^^^^^^");
});






// the very last route '/*' (details at http://ericclemmons.com/angular/using-html5-not-hash-routes/) 
app.get('/*', function(req, res) {
  // AJAX requests are aren't expected to be redirected to the AngularJS app
  if (req.xhr) {
    return res.status(404).send(req.url + ' not found');
  }
  // `sendfile` requires the safe, resolved path to your AngularJS app
  // res.sendfile(path.resolve(__dirname + '/public/index.html'));
  res.sendFile('/public/index.html', { root: __dirname });
});
app.listen(process.env.PORT || 5000, function () {
  console.log('Server listening on port '+ (process.env.PORT || 5000) +'!')
})
