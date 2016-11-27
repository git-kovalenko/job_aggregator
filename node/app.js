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

// console.log(process.argv)

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
var pool  = mysql.createPool(config.mysql);
var database = require('./database')(pool);

var moment = require('moment');
var cheerio = require('cheerio');
// var request = require('request');
// var req = request.defaults({'proxy':'http://wsproxy.alfa.bank.int:3128'});

// var grabber = require('./grabber')(database, request, moment, cheerio);
// grabber.grabe();
// database.createTable();
var async = require('async');
var browser = require('zombie');

// browser.proxy = 'http://wsproxy.alfa.bank.int:3128';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var scrapper = require('./scrapper_zombie')(database, browser, moment, cheerio, async);
// scrapper.scrape(30, 40);
/*database.getAll(function(result){
	c.log(result[0])
});*/

var express = require('express');
var app = express();
 
app.get('/', function (req, res) {
  res.send('Hello World')
});
app.get('/getAll', function (req, res) {
	database.getAll(function(result){
  		res.send(result[0]	)
	});
});
 
app.listen(3000, function () {
  console.log('Server listening on port 3000!')
})
